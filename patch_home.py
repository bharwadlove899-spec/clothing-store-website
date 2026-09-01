with open('src/pages/Home.tsx', 'r') as f:
    content = f.read()

content = content.replace('import { collection, getDocs, query, where, orderBy, limit } from "firebase/firestore";', 'import { getCachedNewArrivals } from "../lib/cache";')
content = content.replace('import { db } from "../lib/firebase";\n', '')

import re
old_fetch = re.search(r'const fetchProducts = async \(\) => \{.*?setLoading\(false\);\s*\}\s*\};\s*\};\s*fetchProducts\(\);', content, re.DOTALL)
if old_fetch:
    print("Found old fetch in Home.tsx")
else:
    print("Not found in Home.tsx")

new_fetch = """const fetchProducts = async () => {
      try {
        const data = await getCachedNewArrivals();
        setNewArrivals(data.slice(0, 6));
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();"""

content = re.sub(r'const fetchProducts = async \(\) => \{.*?setLoading\(false\);\s*\}\s*\};\s*\};\s*fetchProducts\(\);', new_fetch, content, flags=re.DOTALL)

with open('src/pages/Home.tsx', 'w') as f:
    f.write(content)
