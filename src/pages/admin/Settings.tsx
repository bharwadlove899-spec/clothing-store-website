import React from "react";
import { useState, useEffect } from 'react';
import { doc, getDoc, setDoc, Timestamp } from 'firebase/firestore';
import { db } from '../../lib/firebase';
import { StoreSettings } from '../../types';

const defaultSettings: StoreSettings = {
  store_name: 'RAYKA KAPDA HOUSE',
  phone: '',
  whatsapp: '9723770286',
  address: 'Vastral, Ahmedabad',
  hours: '10:00 AM - 9:00 PM',
  instagram: '',
  maps_url: '',
  currency: 'INR',
  low_stock_threshold: 5,
  updated_at: Timestamp.now()
};

export default function Settings() {
  const [settings, setSettings] = useState<StoreSettings>(defaultSettings);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const snap = await getDoc(doc(db, 'settings', 'store_settings'));
        if (snap.exists()) {
          setSettings(snap.data() as StoreSettings);
        }
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    fetchSettings();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setMessage('');
    try {
      await setDoc(doc(db, 'settings', 'store_settings'), {
        ...settings,
        updated_at: Timestamp.now()
      });
      setMessage('Settings saved successfully.');
    } catch (err: any) {
      setMessage(`Error: ${err.message}`);
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="text-zinc-400">Loading settings...</div>;

  return (
    <div className="max-w-2xl space-y-6">
      <h2 className="text-2xl font-serif tracking-wide text-white">Store Settings</h2>

      {message && (
        <div className={`p-3 text-sm rounded border ${message.includes('Error') ? 'bg-red-900/50 border-red-500 text-red-200' : 'bg-green-900/50 border-green-500 text-green-200'}`}>
          {message}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="bg-zinc-900 border border-zinc-800 p-6 rounded space-y-4">
          <h3 className="text-sm uppercase tracking-widest font-bold text-zinc-400 border-b border-zinc-800 pb-2">General Info</h3>
          
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-bold uppercase text-zinc-500 mb-1">Store Name</label>
              <input type="text" required value={settings.store_name} onChange={e => setSettings({...settings, store_name: e.target.value})} className="w-full bg-black border border-zinc-800 p-3 text-white text-sm focus:outline-none focus:border-zinc-500" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold uppercase text-zinc-500 mb-1">WhatsApp Number</label>
                <input type="text" value={settings.whatsapp} onChange={e => setSettings({...settings, whatsapp: e.target.value})} className="w-full bg-black border border-zinc-800 p-3 text-white text-sm focus:outline-none focus:border-zinc-500" />
              </div>
              <div>
                <label className="block text-xs font-bold uppercase text-zinc-500 mb-1">Phone Number</label>
                <input type="text" value={settings.phone} onChange={e => setSettings({...settings, phone: e.target.value})} className="w-full bg-black border border-zinc-800 p-3 text-white text-sm focus:outline-none focus:border-zinc-500" />
              </div>
            </div>
            <div>
              <label className="block text-xs font-bold uppercase text-zinc-500 mb-1">Address</label>
              <textarea rows={2} value={settings.address} onChange={e => setSettings({...settings, address: e.target.value})} className="w-full bg-black border border-zinc-800 p-3 text-white text-sm focus:outline-none focus:border-zinc-500" />
            </div>
            <div>
              <label className="block text-xs font-bold uppercase text-zinc-500 mb-1">Opening Hours</label>
              <input type="text" value={settings.hours} onChange={e => setSettings({...settings, hours: e.target.value})} className="w-full bg-black border border-zinc-800 p-3 text-white text-sm focus:outline-none focus:border-zinc-500" />
            </div>
          </div>
        </div>

        <div className="bg-zinc-900 border border-zinc-800 p-6 rounded space-y-4">
          <h3 className="text-sm uppercase tracking-widest font-bold text-zinc-400 border-b border-zinc-800 pb-2">Links & Config</h3>
          
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-bold uppercase text-zinc-500 mb-1">Instagram URL</label>
              <input type="url" value={settings.instagram} onChange={e => setSettings({...settings, instagram: e.target.value})} className="w-full bg-black border border-zinc-800 p-3 text-white text-sm focus:outline-none focus:border-zinc-500" />
            </div>
            <div>
              <label className="block text-xs font-bold uppercase text-zinc-500 mb-1">Google Maps URL</label>
              <input type="url" value={settings.maps_url} onChange={e => setSettings({...settings, maps_url: e.target.value})} className="w-full bg-black border border-zinc-800 p-3 text-white text-sm focus:outline-none focus:border-zinc-500" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold uppercase text-zinc-500 mb-1">Low Stock Threshold</label>
                <input type="number" min="0" value={settings.low_stock_threshold} onChange={e => setSettings({...settings, low_stock_threshold: Number(e.target.value)})} className="w-full bg-black border border-zinc-800 p-3 text-white text-sm focus:outline-none focus:border-zinc-500" />
              </div>
            </div>
          </div>
        </div>

        <button type="submit" disabled={saving} className="w-full bg-white text-black py-4 text-xs font-bold uppercase tracking-widest hover:bg-neutral-200 transition-colors disabled:opacity-50">
          {saving ? 'Saving...' : 'Save Settings'}
        </button>
      </form>
    </div>
  );
}
