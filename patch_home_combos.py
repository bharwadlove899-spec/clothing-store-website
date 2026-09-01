import re

with open('src/pages/Home.tsx', 'r') as f:
    content = f.read()

# 1. Add combos state
old_state = "const [newArrivals, setNewArrivals] = useState<Product[]>([]);"
new_state = "const [newArrivals, setNewArrivals] = useState<Product[]>([]);\n  const [combos, setCombos] = useState<Product[]>([]);"
content = content.replace(old_state, new_state)

# 2. Fetch combos
old_fetch = """        const q = query(
          collection(db, 'products'),
          where('is_active', '==', true),
          orderBy('created_at', 'desc'),
          limit(6)
        );
        const snap = await getDocs(q);
        setNewArrivals(snap.docs.map(d => ({ id: d.id, ...d.data() } as Product)));"""

new_fetch = """        const q = query(
          collection(db, 'products'),
          where('is_active', '==', true),
          orderBy('created_at', 'desc'),
          limit(6)
        );
        const snap = await getDocs(q);
        setNewArrivals(snap.docs.map(d => ({ id: d.id, ...d.data() } as Product)));

        const comboQ = query(
          collection(db, 'products'),
          where('is_active', '==', true),
          where('category', '==', 'Combo'),
          orderBy('created_at', 'desc'),
          limit(2)
        );
        const comboSnap = await getDocs(comboQ);
        setCombos(comboSnap.docs.map(d => ({ id: d.id, ...d.data() } as Product)));"""
content = content.replace(old_fetch, new_fetch)

# 3. Add Combos Section below New Arrivals
old_new_arrivals_end = """        </div>
      </section>

      {/* Product Modal */}"""

combos_section = """        </div>
      </section>

      {/* Exclusive Combos Row */}
      <section className="py-12 max-w-[1400px] mx-auto px-6">
        <div className="flex justify-between items-end mb-10 border-b border-zinc-900 pb-4">
          <span className="text-[10px] text-zinc-400 uppercase tracking-[0.4em] font-bold">Exclusive Combos</span>
          <Link to="/collections?category=Combo" className="text-[9px] text-white hover:text-primary transition-colors uppercase tracking-[0.2em] font-bold flex items-center gap-2">
            View All Combos <ArrowRight size={12} />
          </Link>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {loading ? (
            <div className="col-span-full text-center py-20 text-zinc-500 text-sm">Loading...</div>
          ) : combos.length === 0 ? (
            <div className="col-span-full text-center py-20 text-zinc-500 text-sm">No combos found.</div>
          ) : (
            combos.map((product) => {
              const hasStock = Object.values(product.sizes || {}).some(qty => (qty as number) > 0);
              return (
                <div key={product.id} className="group cursor-pointer flex flex-col sm:flex-row bg-black-light border border-zinc-900 overflow-hidden hover:border-zinc-700 transition-colors" onClick={() => setSelectedProduct(product)}>
                  <div className="relative aspect-[4/5] sm:w-1/2 sm:aspect-[3/4] bg-black overflow-hidden shrink-0">
                    {product.images?.[0] && (
                      <img loading="lazy" src={product.images[0]} alt={product.name} className="w-full h-full object-cover opacity-80 group-hover:opacity-100 group-hover:scale-105 transition-all duration-700" />
                    )}
                    {!hasStock && (
                      <div className="absolute inset-0 bg-black/60 flex items-center justify-center backdrop-blur-[2px]">
                        <span className="bg-red-600 text-white font-bold uppercase tracking-widest px-3 py-1 text-[10px] border border-red-400">Sold Out</span>
                      </div>
                    )}
                    {product.sale_price && (
                      <span className="absolute top-4 left-4 bg-primary text-white text-[9px] font-bold tracking-widest uppercase px-3 py-1.5">
                        Sale
                      </span>
                    )}
                  </div>
                  <div className="p-6 sm:p-8 flex flex-col justify-center sm:w-1/2">
                    <p className="text-[10px] text-zinc-500 uppercase tracking-widest mb-2">{product.category}</p>
                    <h4 className="text-lg md:text-xl font-serif text-white mb-4 line-clamp-2">{product.name}</h4>
                    <p className="text-sm font-mono text-white mb-6">
                      {product.sale_price ? (
                        <span className="flex gap-3 items-center">
                          <span className="text-zinc-500 line-through">₹{product.price}</span>
                          <span className="text-primary text-lg">₹{product.sale_price}</span>
                        </span>
                      ) : (
                        <span className="text-lg">₹{product.price}</span>
                      )}
                    </p>
                    
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedProduct(product);
                      }}
                      className="w-full py-4 bg-white text-black text-[10px] font-bold uppercase tracking-widest hover:bg-neutral-200 transition-colors mt-auto"
                    >
                      View Details
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </section>

      {/* Product Modal */}"""

content = content.replace(old_new_arrivals_end, combos_section)

with open('src/pages/Home.tsx', 'w') as f:
    f.write(content)
