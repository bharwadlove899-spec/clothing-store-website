import { useEffect, useState } from 'react';
import { collection, getDocs, query, orderBy, doc, updateDoc } from 'firebase/firestore';
import { db } from '../../lib/firebase';
import { Product } from '../../types';
import { Search, Minus, Plus } from 'lucide-react';

export default function Inventory() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [savingId, setSavingId] = useState<string | null>(null);

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

  const handleStockChange = (productId: string, size: string, delta: number) => {
    setProducts(prev => prev.map(p => {
      if (p.id === productId) {
        const currentStock = p.sizes[size] || 0;
        const newStock = Math.max(0, currentStock + delta);
        return { ...p, sizes: { ...p.sizes, [size]: newStock } };
      }
      return p;
    }));
  };

  const handleManualInput = (productId: string, size: string, value: string) => {
    const num = parseInt(value);
    if (isNaN(num) || num < 0) return;
    setProducts(prev => prev.map(p => {
      if (p.id === productId) {
        return { ...p, sizes: { ...p.sizes, [size]: num } };
      }
      return p;
    }));
  };

  const saveInventory = async (product: Product) => {
    setSavingId(product.id);
    try {
      await updateDoc(doc(db, 'products', product.id), { sizes: product.sizes });
    } catch (e) {
      console.error(e);
    } finally {
      setSavingId(null);
    }
  };

  const filteredProducts = products.filter(p => 
    p.name.toLowerCase().includes(search.toLowerCase()) || 
    p.category.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-serif tracking-wide text-white">Inventory Management</h2>

      <div className="relative w-full max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" size={16} />
        <input 
          type="text" 
          placeholder="Search products by name or category..." 
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full bg-zinc-900 border border-zinc-800 text-white pl-10 pr-4 py-2 text-sm focus:outline-none focus:border-zinc-500 rounded"
        />
      </div>

      <div className="space-y-4">
        {loading ? (
          <div className="text-zinc-400">Loading inventory...</div>
        ) : filteredProducts.length === 0 ? (
          <div className="text-zinc-400">No products found.</div>
        ) : (
          filteredProducts.map((product) => {
            const totalStock = Object.values(product.sizes || {}).reduce((a, b) => (a as number) + (b as number), 0) as number;
            const status = totalStock === 0 ? "OUT OF STOCK" : totalStock <= 5 ? "LOW STOCK" : "IN STOCK";
            const statusColor = totalStock === 0 ? "text-red-400" : totalStock <= 5 ? "text-amber-400" : "text-green-400";

            return (
              <div key={product.id} className="bg-zinc-900 border border-zinc-800 p-6 rounded">
                <div className="flex flex-col md:flex-row justify-between md:items-center mb-6 gap-4 border-b border-zinc-800 pb-4">
                  <div className="flex items-center gap-4">
                    {product.images?.[0] && (
                      <img src={product.images[0]} alt="" className="w-12 h-16 object-cover bg-black" />
                    )}
                    <div>
                      <h3 className="font-bold text-white text-lg">{product.name}</h3>
                      <p className="text-xs text-zinc-400 uppercase tracking-widest">{product.category}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className={`text-xs font-bold uppercase tracking-widest mb-1 ${statusColor}`}>{status}</p>
                    <p className="text-sm font-mono text-zinc-400">Total Stock: {totalStock}</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7 gap-4 mb-6">
                  {Object.entries(product.sizes || {}).map(([size, qty]) => (
                    <div key={size} className="bg-black border border-zinc-800 rounded p-3 flex flex-col items-center">
                      <span className="text-xs font-bold uppercase text-zinc-500 mb-2">{size}</span>
                      <div className="flex items-center gap-2">
                        <button onClick={() => handleStockChange(product.id, size, -1)} className="p-1 bg-zinc-800 hover:bg-zinc-700 text-white rounded">
                          <Minus size={14} />
                        </button>
                        <input 
                          type="number" 
                          min="0"
                          value={qty}
                          onChange={(e) => handleManualInput(product.id, size, e.target.value)}
                          className="w-12 bg-transparent text-center text-white font-mono text-sm focus:outline-none"
                        />
                        <button onClick={() => handleStockChange(product.id, size, 1)} className="p-1 bg-zinc-800 hover:bg-zinc-700 text-white rounded">
                          <Plus size={14} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="flex justify-end">
                  <button 
                    onClick={() => saveInventory(product)}
                    disabled={savingId === product.id}
                    className="bg-white text-black px-6 py-2 text-xs font-bold uppercase tracking-widest hover:bg-neutral-200 transition-colors disabled:opacity-50 rounded-sm"
                  >
                    {savingId === product.id ? 'Saving...' : 'Save Changes'}
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
