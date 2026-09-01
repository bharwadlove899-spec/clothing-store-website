import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { collection, getDocs, query, where, doc, getDoc } from "firebase/firestore";
import { db } from "./src/lib/firebase";

async function startServer() {
  const app = express();
  const PORT = 3000;

  // Shared Server-Side Cache
  const sharedCache = {
    products: null as any[] | null,
    settings: null as any | null,
    lastFetchTime: 0
  };
  
  // Cache stampede prevention lock
  let activeFetchPromise: Promise<any> | null = null;

  const CACHE_DURATION_MS = 1000 * 60 * 5; // 5 minutes

  // Single API route for all public data to minimize requests
  app.get("/api/public-data", async (req, res) => {
    try {
      const now = Date.now();
      
      // Return memory cache if valid
      if (sharedCache.products && sharedCache.settings && (now - sharedCache.lastFetchTime < CACHE_DURATION_MS)) {
        return res.json({
          products: sharedCache.products,
          settings: sharedCache.settings,
          source: 'server-cache'
        });
      }

      // Prevent Cache Stampede: If a fetch is already in progress, wait for it instead of starting a new one
      if (!activeFetchPromise) {
        activeFetchPromise = (async () => {
          console.log("[Server] Fetching fresh data from Firestore...");
          
          // 1. Fetch all active products
          const q = query(collection(db, 'products'), where('is_active', '==', true));
          const snap = await getDocs(q);
          const products = snap.docs.map(d => ({ id: d.id, ...d.data() }));

          // 2. Fetch store settings
          const settingsSnap = await getDoc(doc(db, 'settings', 'store_settings'));
          const settings = settingsSnap.exists() ? settingsSnap.data() : null;

          // Update cache
          sharedCache.products = products;
          sharedCache.settings = settings;
          sharedCache.lastFetchTime = Date.now();

          return { products, settings, source: 'firestore' };
        })().finally(() => {
          // Release the lock when done (success or fail)
          activeFetchPromise = null;
        });
      }

      const freshData = await activeFetchPromise;
      return res.json(freshData);
      
    } catch (error) {
      console.error("[Server] Error fetching public data:", error);
      res.status(500).json({ error: "Failed to fetch data" });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    // Production static serving
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*all', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
