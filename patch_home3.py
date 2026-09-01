import re
with open('src/pages/Home.tsx', 'r') as f:
    content = f.read()

content = content.replace('import { collection, getDocs, query, where, orderBy, limit } from "firebase/firestore";', 'import { getCachedNewArrivals } from "../lib/cache";')
content = content.replace('import { db } from "../lib/firebase";', '')

pattern = r"const fetchProducts = async \(\) => \{.*?setLoading\(false\);\s*\}\s*\};"
new_fetch = """const fetchProducts = async () => {
      try {
        const data = await getCachedNewArrivals();
        setNewArrivals(data.slice(0, 6));
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };"""

content = re.sub(pattern, new_fetch, content, flags=re.DOTALL)

with open('src/pages/Home.tsx', 'w') as f:
    f.write(content)
