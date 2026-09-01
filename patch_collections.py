import re

with open('src/pages/Collections.tsx', 'r') as f:
    content = f.read()

# Add import
content = content.replace('import { collection, getDocs, query, where, orderBy } from "firebase/firestore";', 'import { getCachedProducts } from "../lib/cache";')
content = content.replace('import { db } from "../lib/firebase";\n', '')

# Replace fetchProducts
old_fetch = """    const fetchProducts = async () => {
      try {
        const q = query(collection(db, 'products'), where('is_active', '==', true));
        const snap = await getDocs(q);
        const data = snap.docs.map(d => ({ id: d.id, ...d.data() } as Product));
        setProducts(data);
        
        // Extract unique categories
        const cats = new Set(data.map(p => p.category));
        setCategories(["All", ...Array.from(cats)]);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };"""

new_fetch = """    const fetchProducts = async () => {
      try {
        const data = await getCachedProducts();
        setProducts(data);
        
        // Extract unique categories
        const cats = new Set(data.map(p => p.category));
        setCategories(["All", ...Array.from(cats)]);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };"""

content = content.replace(old_fetch, new_fetch)

with open('src/pages/Collections.tsx', 'w') as f:
    f.write(content)
