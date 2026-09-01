import re

with open('src/pages/NewArrivals.tsx', 'r') as f:
    content = f.read()

# Add import
content = content.replace('import { collection, getDocs, query, where, orderBy, limit } from "firebase/firestore";', 'import { getCachedNewArrivals } from "../lib/cache";')
content = content.replace('import { db } from "../lib/firebase";\n', '')

# Replace fetchProducts
old_fetch = """    const fetchProducts = async () => {
      try {
        const q = query(collection(db, 'products'), where('is_active', '==', true), orderBy('created_at', 'desc'), limit(12));
        const snap = await getDocs(q);
        setProducts(snap.docs.map(d => ({ id: d.id, ...d.data() } as Product)));
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };"""

new_fetch = """    const fetchProducts = async () => {
      try {
        const data = await getCachedNewArrivals();
        setProducts(data);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };"""

content = content.replace(old_fetch, new_fetch)

with open('src/pages/NewArrivals.tsx', 'w') as f:
    f.write(content)
