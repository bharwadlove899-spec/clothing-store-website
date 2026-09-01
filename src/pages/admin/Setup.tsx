import React from "react";
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc, getDocs, collection } from 'firebase/firestore';
import { auth, db } from '../../lib/firebase';

export default function SetupAdmin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [msg, setMsg] = useState('');
  const [isLocked, setIsLocked] = useState(true);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    // Allowing the owner to setup the account without read-all lock constraint
    setIsLocked(false);
    setLoading(false);
  }, []);

  const handleSetup = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    try {
      let user = null;
      try {
        const userCred = await createUserWithEmailAndPassword(auth, email, password);
        user = userCred.user;
      } catch (createErr: any) {
        if (createErr.code === 'auth/email-already-in-use') {
          // If they already created the auth account but got locked out of the admin doc, log them in and fix it
          const loginCred = await signInWithEmailAndPassword(auth, email, password);
          user = loginCred.user;
        } else {
          throw createErr;
        }
      }
      
      if (user) {
        // Let's try to write the admin document.
        await setDoc(doc(db, 'admins', user.uid), {
          email: user.email,
          role: 'owner',
          created_at: new Date().toISOString()
        });
        
        setMsg("Admin account configured! Redirecting to login...");
        setTimeout(() => navigate('/admin/login'), 2000);
      }
      
    } catch (err: any) {
      setError(err.message || 'Failed to setup admin.');
    }
  };

  if (loading) return <div className="p-8 text-white">Checking system...</div>;

  if (isLocked) {
    return (
      <div className="p-8 text-white text-center max-w-md mx-auto mt-20">
        <h2 className="text-xl font-bold mb-4">Setup Locked</h2>
        <p className="text-zinc-400">An admin account already exists. For security reasons, this setup page is locked.</p>
        <button onClick={() => navigate('/admin/login')} className="mt-6 px-6 py-2 bg-white text-black font-bold">Go to Login</button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-zinc-950 border border-zinc-800 p-8 rounded shadow-2xl">
        <h1 className="text-2xl font-serif text-white text-center tracking-widest mb-2 font-bold">INITIAL SETUP</h1>
        <p className="text-zinc-400 text-sm text-center mb-8">Create your first admin account.</p>
        
        {error && <div className="bg-red-900/50 border border-red-500 text-red-200 p-3 text-sm mb-6 rounded">{error}</div>}
        {msg && <div className="bg-green-900/50 border border-green-500 text-green-200 p-3 text-sm mb-6 rounded">{msg}</div>}
        
        <form onSubmit={handleSetup} className="space-y-4">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-zinc-400 mb-2">Email</label>
            <input type="email" value={email} onChange={e => setEmail(e.target.value)} className="w-full bg-black border border-zinc-800 text-white p-3 focus:outline-none focus:border-zinc-500" required />
          </div>
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-zinc-400 mb-2">Password</label>
            <input type="password" value={password} onChange={e => setPassword(e.target.value)} className="w-full bg-black border border-zinc-800 text-white p-3 focus:outline-none focus:border-zinc-500" required minLength={6} />
          </div>
          <button type="submit" className="w-full bg-white text-black font-bold uppercase tracking-widest text-xs py-4 hover:bg-neutral-200 transition-colors mt-4">
            Create Admin
          </button>
        </form>
      </div>
    </div>
  );
}
