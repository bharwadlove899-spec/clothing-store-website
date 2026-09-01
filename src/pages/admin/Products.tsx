import { useEffect, useState } from 'react';
import { collection, getDocs, query, orderBy, deleteDoc, doc, updateDoc } from 'firebase/firestore';
import { db } from '../../lib/firebase';
import { Product } from '../../types';
import { Link } from 'react-router-dom';
import { Search, Plus, Edit, Copy, Trash, Eye, EyeOff } from 'lucide-react';

export default function Products() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [productToDelete, setProductToDelete] = useState<string | null>(null);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const q = query(collection(db, 'products'), orderBy('created_at', 'desc'));
      const snap = await getDocs(q);
      setProducts(snap.docs.map(d => ({ id: d.id, ...d.data() } as Product)));
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const toggleVisibility = async (id: string, current: boolean) => {
    await updateDoc(doc(db, 'products', id), { is_active: !current });
    fetchProducts();
  };

  const deleteProduct = async () => {
    if (productToDelete) {
      await deleteDoc(doc(db, 'products', productToDelete));
      setProductToDelete(null);
      fetchProducts();
    }
  };

  const filteredProducts = products.filter(p => 
    p.name.toLowerCase().includes(search.toLowerCase()) || 
    p.category.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <h2 className="text-2xl font-serif tracking-wide text-white">Products</h2>
        <Link 
          to="/admin/products/new" 
          className="bg-white text-black px-4 py-2 text-xs font-bold uppercase tracking-widest flex items-center gap-2 hover:bg-neutral-200 transition-colors"
        >
          <Plus size={16} /> Add Product
        </Link>
      </div>

      <div className="bg-zinc-900 border border-zinc-800 rounded p-4">
        <div className="relative w-full max-w-md mb-6">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" size={16} />
          <input 
            type="text" 
            placeholder="Search products..." 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-black border border-zinc-800 text-white pl-10 pr-4 py-2 text-sm focus:outline-none focus:border-zinc-500"
          />
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-zinc-400">
            <thead className="text-xs uppercase bg-black border-b border-zinc-800">
              <tr>
                <th className="px-4 py-3">Image</th>
                <th className="px-4 py-3">Name</th>
                <th className="px-4 py-3">Category</th>
                <th className="px-4 py-3">Price</th>
                <th className="px-4 py-3">Total Stock</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={7} className="text-center py-4">Loading...</td></tr>
              ) : filteredProducts.length === 0 ? (
                <tr><td colSpan={7} className="text-center py-4">No products found.</td></tr>
              ) : (
                filteredProducts.map((product) => {
                  const totalStock = Object.values(product.sizes || {}).reduce((a, b) => (a as number) + (b as number), 0) as number;
                  
                  return (
                    <tr key={product.id} className="border-b border-zinc-800 hover:bg-zinc-800/50 transition-colors">
                      <td className="px-4 py-2">
                        {product.images?.[0] ? (
                          <img src={product.images[0]} alt={product.name} className="w-12 h-16 object-cover bg-black" />
                        ) : (
                          <div className="w-12 h-16 bg-zinc-800 flex items-center justify-center text-xs">No img</div>
                        )}
                      </td>
                      <td className="px-4 py-2 font-medium text-white">{product.name}</td>
                      <td className="px-4 py-2">{product.category}</td>
                      <td className="px-4 py-2 font-mono">₹{product.price}</td>
                      <td className="px-4 py-2 font-mono">{totalStock}</td>
                      <td className="px-4 py-2">
                        <span className={`px-2 py-1 text-[10px] uppercase font-bold tracking-wider ${
                          product.is_active ? 'bg-green-900/30 text-green-400' : 'bg-red-900/30 text-red-400'
                        }`}>
                          {product.is_active ? 'Active' : 'Hidden'}
                        </span>
                      </td>
                      <td className="px-4 py-2 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button onClick={() => toggleVisibility(product.id, product.is_active)} className="p-1.5 text-zinc-500 hover:text-white" title="Toggle Visibility">
                            {product.is_active ? <EyeOff size={16} /> : <Eye size={16} />}
                          </button>
                          <Link to={`/admin/products/${product.id}/edit`} className="p-1.5 text-zinc-500 hover:text-white" title="Edit">
                            <Edit size={16} />
                          </Link>
                          <button onClick={() => setProductToDelete(product.id)} className="p-1.5 text-zinc-500 hover:text-red-400" title="Delete">
                            <Trash size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
      {productToDelete && (
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
}
