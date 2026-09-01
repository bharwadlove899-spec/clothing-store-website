import { useEffect, useState } from 'react';
import { collection, getDocs, query, orderBy } from 'firebase/firestore';
import { db } from '../../lib/firebase';
import { CollectionRecord } from '../../types';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { format, startOfMonth, subMonths } from 'date-fns';

const PIE_COLORS = ['#ffffff', '#a1a1aa', '#52525b', '#27272a'];

export default function Analytics() {
  const [collections, setCollections] = useState<CollectionRecord[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCollections = async () => {
      try {
        const q = query(collection(db, 'sales_collections'), orderBy('date', 'desc'));
        const snap = await getDocs(q);
        setCollections(snap.docs.map(d => ({ id: d.id, ...d.data() } as CollectionRecord)));
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    fetchCollections();
  }, []);

  if (loading) return <div className="text-zinc-400">Loading analytics...</div>;

  const totalCollection = collections.reduce((sum, c) => sum + c.total_amount, 0);
  const avgDaily = collections.length > 0 ? totalCollection / collections.length : 0;
  
  let maxDay = collections[0];
  let minDay = collections[0];
  
  let totalCash = 0;
  let totalUpi = 0;
  let totalCard = 0;
  let totalOther = 0;

  const thisMonthStr = format(startOfMonth(new Date()), 'yyyy-MM');
  const prevMonthStr = format(subMonths(new Date(), 1), 'yyyy-MM');

  let thisMonthTotal = 0;
  let prevMonthTotal = 0;

  collections.forEach(c => {
    if (c.total_amount > (maxDay?.total_amount || 0)) maxDay = c;
    if (c.total_amount < (minDay?.total_amount || Infinity)) minDay = c;
    
    totalCash += c.cash_amount;
    totalUpi += c.upi_amount;
    totalCard += c.card_amount;
    totalOther += c.other_amount;

    if (c.date.startsWith(thisMonthStr)) thisMonthTotal += c.total_amount;
    if (c.date.startsWith(prevMonthStr)) prevMonthTotal += c.total_amount;
  });

  const momGrowth = prevMonthTotal === 0 ? 100 : ((thisMonthTotal - prevMonthTotal) / prevMonthTotal) * 100;

  const chartData = collections.slice(0, 30).reverse().map(c => ({
    name: format(new Date(c.date), 'MMM dd'),
    total: c.total_amount
  }));

  const pieData = [
    { name: 'UPI', value: totalUpi },
    { name: 'Cash', value: totalCash },
    { name: 'Card', value: totalCard },
    { name: 'Other', value: totalOther },
  ].filter(d => d.value > 0);

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-serif tracking-wide text-white">Analytics</h2>
      
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-zinc-900 border border-zinc-800 p-4 rounded">
          <p className="text-[10px] text-zinc-400 uppercase tracking-widest font-bold mb-1">Total Lifetime</p>
          <p className="text-xl font-mono text-white">₹{totalCollection.toLocaleString('en-IN')}</p>
        </div>
        <div className="bg-zinc-900 border border-zinc-800 p-4 rounded">
          <p className="text-[10px] text-zinc-400 uppercase tracking-widest font-bold mb-1">Avg Daily</p>
          <p className="text-xl font-mono text-white">₹{Math.round(avgDaily).toLocaleString('en-IN')}</p>
        </div>
        <div className="bg-zinc-900 border border-zinc-800 p-4 rounded">
          <p className="text-[10px] text-zinc-400 uppercase tracking-widest font-bold mb-1">Highest Day</p>
          <p className="text-xl font-mono text-white">₹{maxDay?.total_amount.toLocaleString('en-IN') || 0}</p>
          <p className="text-xs text-zinc-500 mt-1">{maxDay?.date}</p>
        </div>
        <div className="bg-zinc-900 border border-zinc-800 p-4 rounded">
          <p className="text-[10px] text-zinc-400 uppercase tracking-widest font-bold mb-1">MoM Growth</p>
          <p className={`text-xl font-mono ${momGrowth >= 0 ? 'text-green-400' : 'text-red-400'}`}>
            {momGrowth > 0 ? '+' : ''}{momGrowth.toFixed(1)}%
          </p>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-zinc-900 border border-zinc-800 p-6 rounded h-[400px]">
          <h3 className="text-sm font-bold uppercase tracking-widest text-zinc-400 mb-6">30-Day Trend</h3>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData}>
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
        
        <div className="bg-zinc-900 border border-zinc-800 p-6 rounded h-[400px] flex flex-col">
          <h3 className="text-sm font-bold uppercase tracking-widest text-zinc-400 mb-6">Payment Methods</h3>
          <div className="flex-1 min-h-0">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ backgroundColor: '#18181b', border: '1px solid #27272a', borderRadius: '4px' }}
                  itemStyle={{ color: '#fff' }}
                  formatter={(value: number) => [`₹${value.toLocaleString('en-IN')}`, 'Amount']}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-6 grid grid-cols-2 gap-4">
            {pieData.map((d, i) => (
              <div key={d.name} className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: PIE_COLORS[i % PIE_COLORS.length] }} />
                <div>
                  <p className="text-xs text-zinc-400 font-bold uppercase">{d.name}</p>
                  <p className="text-sm text-white font-mono">₹{d.value.toLocaleString('en-IN')}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
