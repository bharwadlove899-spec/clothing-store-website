import { useEffect, useState } from 'react';
import { collection, query, getDocs, orderBy } from 'firebase/firestore';
import { db } from '../../lib/firebase';
import { Product, CollectionRecord, StoreSettings } from '../../types';
import { format, subDays } from 'date-fns';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { AlertTriangle } from 'lucide-react';
import { doc, getDoc } from 'firebase/firestore';

export default function Dashboard() {
  const [products, setProducts] = useState<Product[]>([]);
  const [collections, setCollections] = useState<CollectionRecord[]>([]);
  const [threshold, setThreshold] = useState(5);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const prodSnapshot = await getDocs(query(collection(db, 'products')));
        const prods = prodSnapshot.docs.map(d => ({ id: d.id, ...d.data() } as Product));
        
        const collSnapshot = await getDocs(query(collection(db, 'sales_collections'), orderBy('date', 'desc')));
        const colls = collSnapshot.docs.map(d => ({ id: d.id, ...d.data() } as CollectionRecord));
        
        const settingsSnap = await getDoc(doc(db, 'settings', 'store_settings'));
        if (settingsSnap.exists()) {
          setThreshold((settingsSnap.data() as StoreSettings).low_stock_threshold || 5);
        }

        setProducts(prods);
        setCollections(colls);
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) return <div className="text-zinc-400">Loading dashboard data...</div>;

  const todayStr = format(new Date(), 'yyyy-MM-dd');
  const thisMonthStr = format(new Date(), 'yyyy-MM');
  
  const todayColl = collections.find(c => c.date === todayStr)?.total_amount || 0;
  
  const thisMonthColl = collections
    .filter(c => c.date.startsWith(thisMonthStr))
    .reduce((sum, c) => sum + c.total_amount, 0);

  const activeProducts = products.filter(p => p.is_active);
  
  let outOfStock = 0;
  let lowStockProducts: { name: string, size: string, left: number }[] = [];
  
  activeProducts.forEach(p => {
    let totalStock = 0;
    Object.entries(p.sizes || {}).forEach(([size, qty]) => {
      const q = qty as number;
      totalStock += q;
      if (q > 0 && q <= threshold) {
        lowStockProducts.push({ name: p.name, size, left: q });
      }
    });
    
    if (totalStock === 0) {
      outOfStock++;
    }
  });

  const last7Days = Array.from({ length: 7 }).map((_, i) => {
    const d = subDays(new Date(), 6 - i);
    const dStr = format(d, 'yyyy-MM-dd');
    const c = collections.find(x => x.date === dStr);
    return {
      name: format(d, 'MMM dd'),
      total: c ? c.total_amount : 0
    };
  });

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-serif tracking-wide text-white">Dashboard</h2>
      
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-zinc-900 border border-zinc-800 p-4 rounded">
          <p className="text-xs text-zinc-400 uppercase tracking-widest font-bold mb-1">Today's Collection</p>
          <p className="text-2xl font-mono text-white">₹{todayColl.toLocaleString('en-IN')}</p>
        </div>
        <div className="bg-zinc-900 border border-zinc-800 p-4 rounded">
          <p className="text-xs text-zinc-400 uppercase tracking-widest font-bold mb-1">This Month</p>
          <p className="text-2xl font-mono text-white">₹{thisMonthColl.toLocaleString('en-IN')}</p>
        </div>
        <div className="bg-zinc-900 border border-zinc-800 p-4 rounded">
          <p className="text-xs text-zinc-400 uppercase tracking-widest font-bold mb-1">Total Products</p>
          <p className="text-2xl font-mono text-white">{activeProducts.length}</p>
        </div>
        <div className="bg-zinc-900 border border-zinc-800 p-4 rounded">
          <p className="text-xs text-red-400 uppercase tracking-widest font-bold mb-1">Out of Stock</p>
          <p className="text-2xl font-mono text-red-400">{outOfStock}</p>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-zinc-900 border border-zinc-800 p-6 rounded h-[350px]">
          <h3 className="text-sm text-zinc-400 uppercase tracking-widest font-bold mb-6">Last 7 Days Collection</h3>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={last7Days}>
              <XAxis dataKey="name" stroke="#52525b" fontSize={10} tickLine={false} axisLine={false} />
              <YAxis stroke="#52525b" fontSize={10} tickLine={false} axisLine={false} tickFormatter={(v) => `₹${v}`} />
              <Tooltip 
                contentStyle={{ backgroundColor: '#18181b', border: '1px solid #27272a', borderRadius: '4px' }}
                itemStyle={{ color: '#fff' }}
                formatter={(value: number) => [`₹${value.toLocaleString('en-IN')}`, 'Collection']}
              />
              <Bar dataKey="total" fill="#ffffff" radius={[2, 2, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-zinc-900 border border-zinc-800 p-6 rounded h-[350px] overflow-y-auto flex flex-col">
          <h3 className="text-sm text-amber-400 uppercase tracking-widest font-bold mb-4 flex items-center gap-2">
            <AlertTriangle size={16} /> Low Stock Alerts
          </h3>
          <div className="flex-1">
            {lowStockProducts.length === 0 ? (
              <p className="text-sm text-zinc-500 font-mono">No low stock alerts right now.</p>
            ) : (
              <ul className="space-y-3">
                {lowStockProducts.map((item, i) => (
                  <li key={i} className="flex items-center justify-between border-b border-zinc-800/50 pb-2 last:border-0">
                    <span className="text-xs font-bold text-zinc-300">{item.name} — <span className="text-zinc-500 font-mono">Size {item.size}</span></span>
                    <span className="text-xs font-mono text-amber-400 bg-amber-400/10 px-2 py-1 rounded">{item.left} left</span>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
