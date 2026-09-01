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
const CACHE_DURATION_MS = 1000 * 60; // Reduced to 1 min

export default async function handler(req: any, res: any) {
  // Setup CORS
  res.setHeader('Access-Control-Allow-Credentials', true)
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version')

  if (req.method === 'OPTIONS') {
    res.status(200).end()
    return
  }

  try {
    const now = Date.now();
    
    // Force bypass cache if query param ?fresh=1 is passed
    const forceFresh = req.query?.fresh === '1';

    // Return memory cache if valid
    if (!forceFresh && sharedCache.products && sharedCache.settings && (now - sharedCache.lastFetchTime < CACHE_DURATION_MS)) {
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
        try {
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
        } catch (innerError) {
          console.error("Firestore Error in Vercel:", innerError);
          throw innerError;
        }
      })().finally(() => {
        activeFetchPromise = null;
      });
    }

    const freshData = await activeFetchPromise;
    return res.status(200).json(freshData);
    
  } catch (error: any) {
    console.error("[Vercel API] Error fetching public data:", error);
    res.status(500).json({ error: "Failed to fetch data", message: error.message });
  }
}
