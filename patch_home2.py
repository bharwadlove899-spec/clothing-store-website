import re
with open('src/pages/Home.tsx', 'r') as f:
    content = f.read()

content = content.replace('import { collection, getDocs, query, where, orderBy, limit } from "firebase/firestore";', 'import { getCachedNewArrivals } from "../lib/cache";')
content = content.replace('import { db } from "../lib/firebase";', '')

old_fetch = """    const fetchProducts = async () => {
      try {
        const q = query(
          collection(db, 'products'),
          where('is_active', '==', true),
          orderBy('created_at', 'desc'),
          limit(6)
        );
        const snap = await getDocs(q);
        setNewArrivals(snap.docs.map(d => ({ id: d.id, ...d.data() } as Product)));
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };"""

new_fetch = """    const fetchProducts = async () => {
      try {
        const data = await getCachedNewArrivals();
        setNewArrivals(data.slice(0, 6));
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };"""

if old_fetch in content:
    content = content.replace(old_fetch, new_fetch)
    print("Replaced!")
else:
    print("Not replaced")

with open('src/pages/Home.tsx', 'w') as f:
    f.write(content)
