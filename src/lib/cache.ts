import { Product } from "../types";
import { collection, getDocs, query, where, doc, getDoc } from "firebase/firestore";
import { db } from "./firebase";

// In-memory cache for the frontend (to prevent unnecessary API calls during a single session)
const clientCache = {
  products: null as Product[] | null,
  newArrivals: null as Product[] | null,
  storeSettings: null as any | null,
  lastFetchTime: 0
};

const CLIENT_CACHE_DURATION_MS = 1000 * 10; // 10 seconds client-side caching to avoid spamming the local API

const fetchFromAPI = async () => {
  const now = Date.now();
  
  if (clientCache.products && (now - clientCache.lastFetchTime < CLIENT_CACHE_DURATION_MS)) {
    return;
  }
  
  try {
    // Attempt to fetch from optimized API first
    const res = await fetch('/api/public-data');
    if (!res.ok) throw new Error('API fetch failed');
    const data = await res.json();
    
    if (data.products) {
      clientCache.products = data.products;
      
      // Derive new arrivals from products
      const sorted = [...data.products].sort((a: any, b: any) => {
        const timeA = a.created_at?.seconds ? a.created_at.seconds * 1000 : (a.created_at ? new Date(a.created_at).getTime() : 0);
        const timeB = b.created_at?.seconds ? b.created_at.seconds * 1000 : (b.created_at ? new Date(b.created_at).getTime() : 0);
        return timeB - timeA;
      });
      clientCache.newArrivals = sorted.slice(0, 12);
    }
    
    if (data.settings) {
      clientCache.storeSettings = data.settings;
    }
    
    clientCache.lastFetchTime = now;
  } catch (err) {
    console.warn("Failed to fetch from API, falling back to direct Firestore fetch:", err);
    
    try {
      // 1. Direct fetch all active products
      const q = query(collection(db, 'products'), where('is_active', '==', true));
      const snap = await getDocs(q);
      const products = snap.docs.map(d => ({ id: d.id, ...d.data() })) as Product[];

      // 2. Direct fetch store settings
      const settingsSnap = await getDoc(doc(db, 'settings', 'store_settings'));
      const settings = settingsSnap.exists() ? settingsSnap.data() : null;

      // Update cache
      clientCache.products = products;
      
      const sorted = [...products].sort((a: any, b: any) => {
        const timeA = a.created_at?.seconds ? a.created_at.seconds * 1000 : (a.created_at ? new Date(a.created_at).getTime() : 0);
        const timeB = b.created_at?.seconds ? b.created_at.seconds * 1000 : (b.created_at ? new Date(b.created_at).getTime() : 0);
        return timeB - timeA;
      });
      clientCache.newArrivals = sorted.slice(0, 12);
      
      clientCache.storeSettings = settings;
      clientCache.lastFetchTime = now;
      
    } catch (firebaseErr) {
      console.error("Direct Firestore fallback fetch also failed:", firebaseErr);
    }
  }
};

export const getCachedProducts = async (): Promise<Product[]> => {
  await fetchFromAPI();
  return clientCache.products || [];
};

export const getCachedNewArrivals = async (): Promise<Product[]> => {
  await fetchFromAPI();
  return clientCache.newArrivals || [];
};

export const getCachedStoreSettings = async (): Promise<any> => {
  await fetchFromAPI();
  return clientCache.storeSettings || null;
};
