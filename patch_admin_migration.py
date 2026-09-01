import re

with open('src/pages/admin/Products.tsx', 'r') as f:
    content = f.read()

import_pattern = "import { collection, getDocs, query, orderBy, deleteDoc, doc, updateDoc } from 'firebase/firestore';"
import_replacement = "import { collection, getDocs, query, orderBy, deleteDoc, doc, updateDoc, writeBatch } from 'firebase/firestore';"
content = content.replace(import_pattern, import_replacement)

button_pattern = """        <h2 className="text-2xl font-serif tracking-wide text-white">Products</h2>
        <Link 
          to="/admin/products/new" 
          className="bg-white text-black px-4 py-2 text-xs font-bold uppercase tracking-widest flex items-center gap-2 hover:bg-neutral-200 transition-colors"
        >
          <Plus size={16} /> Add Product
        </Link>
      </div>"""

button_replacement = """        <h2 className="text-2xl font-serif tracking-wide text-white">Products</h2>
        <div className="flex gap-4">
          <button 
            onClick={async () => {
              const batch = writeBatch(db);
              let count = 0;
              for (const p of products) {
                if (p.is_active === undefined) {
                  batch.update(doc(db, 'products', p.id), { is_active: true });
                  count++;
                }
              }
              if (count > 0) {
                await batch.commit();
                alert(`Fixed ${count} missing product statuses! They will now show on the website.`);
                fetchProducts();
              } else {
                alert('All products are already fixed.');
              }
            }}
            className="bg-red-900/30 text-red-400 border border-red-900/50 px-4 py-2 text-xs font-bold uppercase tracking-widest flex items-center gap-2 hover:bg-red-900/50 transition-colors"
          >
            Fix Hidden Products
          </button>
          <Link 
            to="/admin/products/new" 
            className="bg-white text-black px-4 py-2 text-xs font-bold uppercase tracking-widest flex items-center gap-2 hover:bg-neutral-200 transition-colors"
          >
            <Plus size={16} /> Add Product
          </Link>
        </div>
      </div>"""

if button_pattern in content:
    content = content.replace(button_pattern, button_replacement)
    print("Patched admin successfully")
else:
    print("Could not find button pattern in Products.tsx")

with open('src/pages/admin/Products.tsx', 'w') as f:
    f.write(content)
