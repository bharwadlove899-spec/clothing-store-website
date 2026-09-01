import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { collection, addDoc, doc, getDoc, updateDoc, Timestamp } from 'firebase/firestore';
import { db } from '../../lib/firebase';
import { X, Plus, Upload } from 'lucide-react';

const CATEGORIES = ["Shirt", "T-shirt", "Jeans", "Combo"];
const DEFAULT_SIZES = ["XS", "S", "M", "L", "XL", "XXL", "XXXL"];

export default function AddProduct() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const [formData, setFormData] = useState({
    name: '',
    category: CATEGORIES[0],
    subcategory: '',
    description: '',
    price: '',
    sale_price: '',
    images: [] as string[],
    colors: [] as string[],
    is_active: true,
  });

  const [sizes, setSizes] = useState<Record<string, number>>({
    XS: 0, S: 0, M: 0, L: 0, XL: 0, XXL: 0, XXXL: 0,
    "28": 0, "30": 0, "32": 0, "34": 0, "36": 0, "38": 0
  });

  const [newImage, setNewImage] = useState('');
  const [newColor, setNewColor] = useState('');

  useEffect(() => {
    if (id) {
      const fetchProduct = async () => {
        try {
          const docSnap = await getDoc(doc(db, 'products', id));
          if (docSnap.exists()) {
            const data = docSnap.data();
            setFormData({
              name: data.name || '',
              category: data.category || CATEGORIES[0],
              subcategory: data.subcategory || '',
              description: data.description || '',
              price: data.price?.toString() || '',
              sale_price: data.sale_price?.toString() || '',
              images: data.images || [],
              colors: data.colors || [],
              is_active: data.is_active ?? true,
            });
            if (data.sizes) {
              setSizes(prev => ({ ...prev, ...data.sizes }));
            }
          }
        } catch (e) {
          console.error(e);
        }
      };
      fetchProduct();
    }
  }, [id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const payload = {
        name: formData.name,
        category: formData.category,
        subcategory: formData.subcategory,
        description: formData.description,
        price: Number(formData.price),
        sale_price: formData.sale_price ? Number(formData.sale_price) : null,
        images: formData.images,
        colors: formData.colors,
        sizes: Object.fromEntries(
          Object.entries(sizes).filter(([size]) => {
            const isJeansSize = ['28', '30', '32', '34', '36', '38'].includes(size);
            if (formData.category === 'Jeans') return isJeansSize;
            if (formData.category === 'Combo') return true;
            return !isJeansSize;
          })
        ),
        is_active: formData.is_active,
        updated_at: Timestamp.now(),
      };

      if (id) {
        await updateDoc(doc(db, 'products', id), payload);
      } else {
        await addDoc(collection(db, 'products'), {
          ...payload,
          created_at: Timestamp.now(),
        });
      }
      navigate('/admin/products');
    } catch (err: any) {
      setError(err.message || 'Failed to save product');
    } finally {
      setLoading(false);
    }
  };

  const addColor = () => {
    if (newColor.trim()) {
      if (!formData.colors.includes(newColor.trim())) {
        setFormData(prev => ({ ...prev, colors: [...prev.colors, newColor.trim()] }));
      }
      setNewColor('');
    }
  };

  const removeColor = (index: number) => {
    setFormData(prev => ({ ...prev, colors: prev.colors.filter((_, i) => i !== index) }));
  };

  const addImage = () => {
    if (newImage.trim()) {
      setFormData(prev => ({ ...prev, images: [...prev.images, newImage.trim()] }));
      setNewImage('');
    }
  };

  const processImageFile = (file: File) => {
    if (!file.type.startsWith('image/')) {
      setError('Please select an image file.');
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const MAX_WIDTH = 800;
        const MAX_HEIGHT = 1000;
        let width = img.width;
        let height = img.height;

        if (width > height) {
          if (width > MAX_WIDTH) {
            height *= MAX_WIDTH / width;
            width = MAX_WIDTH;
          }
        } else {
          if (height > MAX_HEIGHT) {
            width *= MAX_HEIGHT / height;
            height = MAX_HEIGHT;
          }
        }
        
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.drawImage(img, 0, 0, width, height);
          const dataUrl = canvas.toDataURL('image/webp', 0.7);
          setFormData(prev => ({ ...prev, images: [...prev.images, dataUrl] }));
        }
      };
      img.src = e.target?.result as string;
    };
    reader.readAsDataURL(file);
  };

  const removeImage = (index: number) => {
    setFormData(prev => ({ ...prev, images: prev.images.filter((_, i) => i !== index) }));
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <h2 className="text-2xl font-serif tracking-wide text-white">{id ? 'Edit Product' : 'Add New Product'}</h2>
      
      {error && <div className="bg-red-900/50 border border-red-500 text-red-200 p-3 text-sm rounded">{error}</div>}

      <form onSubmit={handleSubmit} className="space-y-8">
        
        {/* Basic Info */}
        <div className="bg-zinc-900 border border-zinc-800 p-6 rounded space-y-4">
          <h3 className="text-sm uppercase tracking-widest font-bold text-zinc-400 border-b border-zinc-800 pb-2">Basic Information</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase text-zinc-500 mb-1">Product Name</label>
              <input required type="text" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full bg-black border border-zinc-800 p-2 text-white text-sm focus:outline-none focus:border-zinc-500" />
            </div>
            <div>
              <label className="block text-xs font-bold uppercase text-zinc-500 mb-1">Category</label>
              <select value={formData.category} onChange={e => setFormData({...formData, category: e.target.value})} className="w-full bg-black border border-zinc-800 p-2 text-white text-sm focus:outline-none focus:border-zinc-500">
                {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold uppercase text-zinc-500 mb-1">Price (₹)</label>
              <input required type="number" min="0" step="0.01" value={formData.price} onChange={e => setFormData({...formData, price: e.target.value})} className="w-full bg-black border border-zinc-800 p-2 text-white text-sm focus:outline-none focus:border-zinc-500" />
            </div>
            <div>
              <label className="block text-xs font-bold uppercase text-zinc-500 mb-1">Sale Price (Optional)</label>
              <input type="number" min="0" step="0.01" value={formData.sale_price} onChange={e => setFormData({...formData, sale_price: e.target.value})} className="w-full bg-black border border-zinc-800 p-2 text-white text-sm focus:outline-none focus:border-zinc-500" />
            </div>
            <div className="md:col-span-2">
              <label className="block text-xs font-bold uppercase text-zinc-500 mb-1">Description</label>
              <textarea rows={3} value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} className="w-full bg-black border border-zinc-800 p-2 text-white text-sm focus:outline-none focus:border-zinc-500" />
            </div>
            <div className="md:col-span-2 flex items-center gap-2 mt-2">
              <input type="checkbox" id="isActive" checked={formData.is_active} onChange={e => setFormData({...formData, is_active: e.target.checked})} className="accent-primary" />
              <label htmlFor="isActive" className="text-sm text-zinc-400">Product is active and visible on public store</label>
            </div>
          </div>
        </div>

        {/* Images */}
        <div className="bg-zinc-900 border border-zinc-800 p-6 rounded space-y-4">
          <h3 className="text-sm uppercase tracking-widest font-bold text-zinc-400 border-b border-zinc-800 pb-2">Images</h3>
          
          {/* File Upload Drag & Drop Area */}
          <div 
            onDragOver={(e) => e.preventDefault()}
            onDrop={(e) => {
              e.preventDefault();
              if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
                Array.from(e.dataTransfer.files).forEach(file => processImageFile(file));
              }
            }}
            className="border-2 border-dashed border-zinc-800 hover:border-zinc-500 transition-colors p-8 flex flex-col items-center justify-center text-center cursor-pointer rounded bg-black/50"
            onClick={() => document.getElementById('file-upload')?.click()}
          >
            <Upload className="text-zinc-500 mb-2" size={24} />
            <p className="text-sm text-zinc-400 font-bold">Drag & drop multiple images here</p>
            <p className="text-xs text-zinc-600 mt-1">or click to browse and select multiple files</p>
            <input 
              id="file-upload" 
              type="file" 
              accept="image/*" 
              multiple
              className="hidden" 
              onChange={(e) => {
                if (e.target.files && e.target.files.length > 0) {
                  Array.from(e.target.files).forEach(file => processImageFile(file));
                }
                e.target.value = '';
              }} 
            />
          </div>

          <div className="flex items-center gap-4 my-2">
            <div className="h-px bg-zinc-800 flex-1"></div>
            <span className="text-xs font-bold text-zinc-600 uppercase">OR PASTE URL</span>
            <div className="h-px bg-zinc-800 flex-1"></div>
          </div>

          <div className="flex gap-2">
            <input 
              type="url" 
              placeholder="Image URL (https://...)" 
              value={newImage} 
              onChange={e => setNewImage(e.target.value)} 
              onKeyDown={e => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  addImage();
                }
              }}
              className="flex-1 bg-black border border-zinc-800 p-2 text-white text-sm focus:outline-none focus:border-zinc-500" 
            />
            <button type="button" onClick={addImage} className="bg-zinc-800 text-white px-4 py-2 text-xs font-bold uppercase hover:bg-zinc-700 transition-colors">Add</button>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
            {formData.images.map((img, i) => (
              <div key={i} className="relative group aspect-[3/4] bg-black border border-zinc-800 flex flex-col overflow-hidden">
                <img src={img} alt="" className="w-full h-full object-cover" />
                {i === 0 && (
                  <div className="absolute top-2 left-2 bg-primary text-white text-[9px] font-bold px-2 py-0.5 rounded shadow-sm">
                    PRIMARY
                  </div>
                )}
                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-between p-2">
                  <div className="flex justify-end">
                    <button type="button" onClick={() => removeImage(i)} className="bg-red-500 text-white p-1 rounded-full hover:bg-red-600">
                      <X size={14} />
                    </button>
                  </div>
                  <div className="flex justify-between items-end">
                    <div className="flex gap-1">
                      {i > 0 && (
                        <button type="button" onClick={() => {
                          const newImages = [...formData.images];
                          [newImages[i - 1], newImages[i]] = [newImages[i], newImages[i - 1]];
                          setFormData(prev => ({ ...prev, images: newImages }));
                        }} className="bg-zinc-800 text-white text-xs px-2 py-1 rounded hover:bg-zinc-700">&larr;</button>
                      )}
                      {i < formData.images.length - 1 && (
                        <button type="button" onClick={() => {
                          const newImages = [...formData.images];
                          [newImages[i + 1], newImages[i]] = [newImages[i], newImages[i + 1]];
                          setFormData(prev => ({ ...prev, images: newImages }));
                        }} className="bg-zinc-800 text-white text-xs px-2 py-1 rounded hover:bg-zinc-700">&rarr;</button>
                      )}
                    </div>
                    {i > 0 && (
                      <button type="button" onClick={() => {
                        const newImages = [...formData.images];
                        const imgToMove = newImages.splice(i, 1)[0];
                        newImages.unshift(imgToMove);
                        setFormData(prev => ({ ...prev, images: newImages }));
                      }} className="bg-zinc-800 text-white text-[9px] px-2 py-1 rounded hover:bg-zinc-700">Make Primary</button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Colors */}
        <div className="bg-zinc-900 border border-zinc-800 p-6 rounded space-y-4">
          <h3 className="text-sm uppercase tracking-widest font-bold text-zinc-400 border-b border-zinc-800 pb-2">Colors</h3>
          <div className="flex gap-2">
            <input 
              type="text" 
              placeholder="e.g., Red, Black, Navy Blue" 
              value={newColor} 
              onChange={e => setNewColor(e.target.value)} 
              onKeyDown={e => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  addColor();
                }
              }}
              className="flex-1 bg-black border border-zinc-800 p-2 text-white text-sm focus:outline-none focus:border-zinc-500" 
            />
            <button type="button" onClick={addColor} className="bg-zinc-800 text-white px-4 py-2 text-xs font-bold uppercase hover:bg-zinc-700 transition-colors">Add</button>
          </div>
          <div className="flex flex-wrap gap-2 mt-4">
            {formData.colors.map((color, i) => (
              <div key={i} className="flex items-center gap-2 bg-black border border-zinc-800 px-3 py-1 rounded-full group">
                <span className="text-sm text-white">{color}</span>
                <button type="button" onClick={() => removeColor(i)} className="text-zinc-500 hover:text-red-500 transition-colors">
                  <X size={14} />
                </button>
              </div>
            ))}
            {formData.colors.length === 0 && <span className="text-xs text-zinc-600">No colors added.</span>}
          </div>
        </div>

        {/* Sizes & Stock */}
        <div className="bg-zinc-900 border border-zinc-800 p-6 rounded space-y-4">
          <h3 className="text-sm uppercase tracking-widest font-bold text-zinc-400 border-b border-zinc-800 pb-2">Sizes & Inventory</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {Object.entries(sizes).filter(([size]) => {
              const isJeansSize = ['28', '30', '32', '34', '36', '38'].includes(size);
              if (formData.category === 'Jeans') return isJeansSize;
              if (formData.category === 'Combo') return true; // Show both
              return !isJeansSize;
            }).map(([size, qty]) => (
              <div key={size} className="flex flex-col">
                <label className="text-xs font-bold uppercase text-zinc-500 mb-1">{['28', '30', '32', '34', '36', '38'].includes(size) ? 'Jeans' : 'Top'} Size {size}</label>
                <input 
                  type="number" 
                  min="0"
                  value={qty} 
                  onChange={e => setSizes({...sizes, [size]: parseInt(e.target.value) || 0})} 
                  className="w-full bg-black border border-zinc-800 p-2 text-white text-sm font-mono focus:outline-none focus:border-zinc-500" 
                />
              </div>
            ))}
          </div>
        </div>

        <div className="flex justify-end gap-4">
          <button type="button" onClick={() => navigate('/admin/products')} className="px-6 py-3 text-xs font-bold uppercase text-zinc-400 hover:text-white transition-colors">Cancel</button>
          <button type="submit" disabled={loading} className="bg-white text-black px-8 py-3 text-xs font-bold uppercase tracking-widest hover:bg-neutral-200 transition-colors disabled:opacity-50">
            {loading ? 'Saving...' : 'Save Product'}
          </button>
        </div>

      </form>
    </div>
  );
}
