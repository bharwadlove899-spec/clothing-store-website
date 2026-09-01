import React, { useState, useEffect } from 'react';
import { collection, addDoc, getDocs, deleteDoc, doc, query, orderBy, Timestamp } from 'firebase/firestore';
import { db } from '../../lib/firebase';
import { CollectionRecord } from '../../types';
import { Plus, Trash, History } from 'lucide-react';
import { format } from 'date-fns';

export default function Collections() {
  const [collections, setCollections] = useState<CollectionRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  
  const [formData, setFormData] = useState({
    date: format(new Date(), 'yyyy-MM-dd'),
    cash: '',
    upi: '',
    card: '',
    other: ''
  });

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

  useEffect(() => {
    fetchCollections();
  }, []);

  const totalAmount = 
    (Number(formData.cash) || 0) + 
    (Number(formData.upi) || 0) + 
    (Number(formData.card) || 0) + 
    (Number(formData.other) || 0);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await addDoc(collection(db, 'sales_collections'), {
        date: formData.date,
        cash_amount: Number(formData.cash) || 0,
        upi_amount: Number(formData.upi) || 0,
        card_amount: Number(formData.card) || 0,
        other_amount: Number(formData.other) || 0,
        total_amount: totalAmount,
        created_at: Timestamp.now(),
        updated_at: Timestamp.now(),
      });
      setFormData({
        date: format(new Date(), 'yyyy-MM-dd'),
        cash: '', upi: '', card: '', other: ''
      });
      fetchCollections();
    } catch (err) {
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to delete this record?")) {
      await deleteDoc(doc(db, 'sales_collections', id));
      fetchCollections();
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-serif tracking-wide text-white">Daily Collection</h2>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        
        {/* Add Collection Form */}
        <div className="lg:col-span-1 bg-zinc-900 border border-zinc-800 p-6 rounded h-fit">
          <h3 className="text-sm font-bold uppercase tracking-widest text-white mb-6 flex items-center gap-2">
            <Plus size={16} /> Add Collection
          </h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold uppercase text-zinc-500 mb-1">Date</label>
              <input type="date" required value={formData.date} onChange={e => setFormData({...formData, date: e.target.value})} className="w-full bg-black border border-zinc-800 p-3 text-white text-sm focus:outline-none focus:border-zinc-500" />
            </div>
            <div>
              <label className="block text-xs font-bold uppercase text-zinc-500 mb-1">Cash (₹)</label>
              <input type="number" min="0" value={formData.cash} onChange={e => setFormData({...formData, cash: e.target.value})} className="w-full bg-black border border-zinc-800 p-3 text-white font-mono text-sm focus:outline-none focus:border-zinc-500" />
            </div>
            <div>
              <label className="block text-xs font-bold uppercase text-zinc-500 mb-1">UPI (₹)</label>
              <input type="number" min="0" value={formData.upi} onChange={e => setFormData({...formData, upi: e.target.value})} className="w-full bg-black border border-zinc-800 p-3 text-white font-mono text-sm focus:outline-none focus:border-zinc-500" />
            </div>
            <div>
              <label className="block text-xs font-bold uppercase text-zinc-500 mb-1">Card (₹)</label>
              <input type="number" min="0" value={formData.card} onChange={e => setFormData({...formData, card: e.target.value})} className="w-full bg-black border border-zinc-800 p-3 text-white font-mono text-sm focus:outline-none focus:border-zinc-500" />
            </div>
            <div>
              <label className="block text-xs font-bold uppercase text-zinc-500 mb-1">Other (₹)</label>
              <input type="number" min="0" value={formData.other} onChange={e => setFormData({...formData, other: e.target.value})} className="w-full bg-black border border-zinc-800 p-3 text-white font-mono text-sm focus:outline-none focus:border-zinc-500" />
            </div>
            
            <div className="border-t border-zinc-800 pt-4 mt-6">
              <div className="flex justify-between items-center mb-6">
                <span className="text-xs font-bold uppercase tracking-widest text-zinc-400">Total</span>
                <span className="text-2xl font-mono text-white">₹{totalAmount.toLocaleString('en-IN')}</span>
              </div>
              <button type="submit" disabled={submitting || totalAmount === 0} className="w-full bg-white text-black py-4 text-xs font-bold uppercase tracking-widest hover:bg-neutral-200 transition-colors disabled:opacity-50">
                {submitting ? 'Saving...' : 'Save Collection'}
              </button>
            </div>
          </form>
        </div>

        {/* History Table */}
        <div className="lg:col-span-2 bg-zinc-900 border border-zinc-800 p-6 rounded">
          <h3 className="text-sm font-bold uppercase tracking-widest text-white mb-6 flex items-center gap-2">
            <History size={16} /> Collection History
          </h3>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-zinc-400">
              <thead className="text-[10px] uppercase tracking-widest font-bold bg-black border-b border-zinc-800 text-zinc-500">
                <tr>
                  <th className="px-4 py-3">Date</th>
                  <th className="px-4 py-3">Cash</th>
                  <th className="px-4 py-3">UPI</th>
                  <th className="px-4 py-3">Card</th>
                  <th className="px-4 py-3">Other</th>
                  <th className="px-4 py-3 text-white font-bold">Total</th>
                  <th className="px-4 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr><td colSpan={7} className="text-center py-4">Loading...</td></tr>
                ) : collections.length === 0 ? (
                  <tr><td colSpan={7} className="text-center py-4">No records found.</td></tr>
                ) : collections.map(c => (
                  <tr key={c.id} className="border-b border-zinc-800/50 hover:bg-zinc-800/30 transition-colors font-mono text-xs">
                    <td className="px-4 py-3">{c.date}</td>
                    <td className="px-4 py-3">₹{c.cash_amount.toLocaleString('en-IN')}</td>
                    <td className="px-4 py-3">₹{c.upi_amount.toLocaleString('en-IN')}</td>
                    <td className="px-4 py-3">₹{c.card_amount.toLocaleString('en-IN')}</td>
                    <td className="px-4 py-3">₹{c.other_amount.toLocaleString('en-IN')}</td>
                    <td className="px-4 py-3 text-white font-bold text-sm">₹{c.total_amount.toLocaleString('en-IN')}</td>
                    <td className="px-4 py-3 text-right">
                      <button onClick={() => handleDelete(c.id)} className="text-zinc-500 hover:text-red-400 p-1">
                        <Trash size={14} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
