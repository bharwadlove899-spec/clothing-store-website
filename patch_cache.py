import re

with open('src/lib/cache.ts', 'r') as f:
    content = f.read()

old_func = """export const getCachedNewArrivals = async (): Promise<Product[]> => {
  const now = Date.now();
  if (cache.newArrivals && (now - cache.newArrivalsFetchTime < CACHE_DURATION_MS)) {
    return cache.newArrivals;
  }
  
  const q = query(
    collection(db, 'products'), 
    where('is_active', '==', true), 
    orderBy('created_at', 'desc'), 
    limit(12)
  );
  const snap = await getDocs(q);
  const data = snap.docs.map(d => ({ id: d.id, ...d.data() } as Product));
  
  cache.newArrivals = data;
  cache.newArrivalsFetchTime = now;
  return data;
};"""

new_func = """export const getCachedNewArrivals = async (): Promise<Product[]> => {
  const now = Date.now();
  
  // If we already have the full catalog, derive new arrivals from there!
  if (cache.products && (now - cache.productsFetchTime < CACHE_DURATION_MS)) {
    const sorted = [...cache.products].sort((a, b) => {
      // created_at could be a Timestamp or just a string depending on how it's saved
      const timeA = a.created_at?.toMillis ? a.created_at.toMillis() : (a.created_at ? new Date(a.created_at as string).getTime() : 0);
      const timeB = b.created_at?.toMillis ? b.created_at.toMillis() : (b.created_at ? new Date(b.created_at as string).getTime() : 0);
      return timeB - timeA;
    });
    return sorted.slice(0, 12);
  }

  if (cache.newArrivals && (now - cache.newArrivalsFetchTime < CACHE_DURATION_MS)) {
    return cache.newArrivals;
  }
  
  const q = query(
    collection(db, 'products'), 
    where('is_active', '==', true), 
    orderBy('created_at', 'desc'), 
    limit(12)
  );
  const snap = await getDocs(q);
  const data = snap.docs.map(d => ({ id: d.id, ...d.data() } as Product));
  
  cache.newArrivals = data;
  cache.newArrivalsFetchTime = now;
  return data;
};"""

content = content.replace(old_func, new_func)

with open('src/lib/cache.ts', 'w') as f:
    f.write(content)
