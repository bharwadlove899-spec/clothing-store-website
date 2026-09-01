import re

with open('src/pages/admin/Products.tsx', 'r') as f:
    content = f.read()

# Add a state for delete product ID
state_add = """  const [search, setSearch] = useState('');
  const [productToDelete, setProductToDelete] = useState<string | null>(null);"""
content = content.replace("  const [search, setSearch] = useState('');", state_add)

# Update deleteProduct logic
old_delete = """  const deleteProduct = async (id: string) => {
    if (confirm("Are you sure you want to delete this product?")) {
      await deleteDoc(doc(db, 'products', id));
      fetchProducts();
    }
  };"""
new_delete = """  const deleteProduct = async () => {
    if (productToDelete) {
      await deleteDoc(doc(db, 'products', productToDelete));
      setProductToDelete(null);
      fetchProducts();
    }
  };"""
content = content.replace(old_delete, new_delete)

# Update the delete button click handler
old_btn = 'onClick={() => deleteProduct(product.id)}'
new_btn = 'onClick={() => setProductToDelete(product.id)}'
content = content.replace(old_btn, new_btn)

# Add the modal at the end of the return statement
old_end = """    </div>
  );
}"""
new_end = """      {productToDelete && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
          <div className="bg-zinc-900 border border-zinc-800 p-6 max-w-sm w-full rounded">
            <h3 className="text-lg font-bold text-white mb-2">Delete Product</h3>
            <p className="text-zinc-400 text-sm mb-6">Are you sure you want to delete this product? This action cannot be undone.</p>
            <div className="flex justify-end gap-3">
              <button 
                onClick={() => setProductToDelete(null)}
                className="px-4 py-2 text-xs font-bold uppercase text-zinc-400 hover:text-white"
              >
                Cancel
              </button>
              <button 
                onClick={deleteProduct}
                className="bg-red-600 text-white px-4 py-2 text-xs font-bold uppercase hover:bg-red-700 transition-colors"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}"""
content = content.replace(old_end, new_end)

with open('src/pages/admin/Products.tsx', 'w') as f:
    f.write(content)

