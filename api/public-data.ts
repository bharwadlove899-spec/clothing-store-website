import { collection, getDocs, query, where, doc, getDoc } from "firebase/firestore";
import { db } from "../src/lib/firebase";

// Shared Serverless Cache for Vercel Instances
const sharedCache = {
  products: null as any[] | null,
  settings: null as any | null,
  lastFetchTime: 0
};

// Cache stampede prevention lock
let activeFetchPromise: Promise<any> | null = null;
const CACHE_DURATION_MS = 1000 * 60 * 5; // 5 minutes

export default async function handler(req: any, res: any) {
  try {
    const now = Date.now();
    
    // Return memory cache if valid
    if (sharedCache.products && sharedCache.settings && (now - sharedCache.lastFetchTime < CACHE_DURATION_MS)) {
      return res.status(200).json({
        products: sharedCache.products,
        settings: sharedCache.settings,
        source: 'vercel-cache'
      });
    }

    // Prevent Cache Stampede
    if (!activeFetchPromise) {
      activeFetchPromise = (async () => {
        console.log("[Vercel] Fetching fresh data from Firestore...");
        
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
        activeFetchPromise = null;
      });
    }

    const freshData = await activeFetchPromise;
    return res.status(200).json(freshData);
    
  } catch (error) {
    console.error("[Vercel API] Error fetching public data:", error);
    res.status(500).json({ error: "Failed to fetch data" });
  }
}
