import { motion } from "motion/react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowRight, Leaf, Diamond, Globe, Heart } from "lucide-react";
import { useState, useEffect } from "react";
import { getCachedNewArrivals } from "../lib/cache";
import { Product } from "../types";
import ProductModal from "../components/ProductModal";

export default function Home() {
  const navigate = useNavigate();
  const [newArrivals, setNewArrivals] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const data = await getCachedNewArrivals();
        setNewArrivals(data.slice(0, 6));
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  return (
    <div className="w-full bg-black-rich">
      {/* Hero Section */}
      <section className="relative h-[85vh] w-full bg-black-rich flex items-center overflow-hidden">
        <div className="absolute inset-0 w-full h-full">
          <img loading="lazy" 
            src="/storefront.jpeg" 
            alt="Rayka Kapda House Storefront" 
            className="w-full h-full object-cover object-center"
          />
        </div>
        
        <div className="relative z-10 max-w-7xl mx-auto px-6 w-full flex flex-col items-start pt-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
          >
            <Link 
              to="/stores" 
              className="bg-primary hover:bg-primary-dark text-white px-8 py-4 text-[10px] font-bold uppercase tracking-widest transition-colors flex items-center justify-center gap-3 w-fit mt-[400px]"
            >
              Visit Store <ArrowRight size={14} />
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Value Proposition Bar */}
      <section className="border-b border-zinc-900 bg-black-light py-8">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-0 divide-y md:divide-y-0 md:divide-x divide-zinc-800">
          <div className="flex items-center justify-center gap-4 py-4 md:py-0">
            <Leaf size={24} className="text-primary font-light" strokeWidth={1} />
            <div className="text-left">
              <h4 className="text-[10px] text-white uppercase tracking-widest font-bold mb-1">Premium Fabrics</h4>
              <p className="text-[10px] text-zinc-500 font-light">Carefully selected materials</p>
            </div>
          </div>
          <div className="flex items-center justify-center gap-4 py-4 md:py-0">
            <Diamond size={24} className="text-primary font-light" strokeWidth={1} />
            <div className="text-left">
              <h4 className="text-[10px] text-white uppercase tracking-widest font-bold mb-1">Timeless Design</h4>
              <p className="text-[10px] text-zinc-500 font-light">Built to last beyond trends</p>
            </div>
          </div>
          <div className="flex items-center justify-center gap-4 py-4 md:py-0">
            <Globe size={24} className="text-primary font-light" strokeWidth={1} />
            <div className="text-left">
              <h4 className="text-[10px] text-white uppercase tracking-widest font-bold mb-1">World Wide Shipping</h4>
              <p className="text-[10px] text-zinc-500 font-light">Delivering luxury anywhere</p>
            </div>
          </div>
        </div>
      </section>

      {/* Shop By Category */}
      <section className="py-24 max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
          <span className="text-[10px] text-zinc-500 uppercase tracking-[0.4em] font-bold block mb-4">Shop By Category</span>
          <h2 className="text-3xl font-serif text-white tracking-tighter">Elevated Essentials</h2>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
          {[
            { name: "Shirt", img: "/category-shirt.jpg" },
            { name: "T-shirt", img: "/category-tshirt.jpg" },
            { name: "Jeans", img: "/category-jeans.jpg" },
            { name: "Combo", img: "/category-combos.jpg" },
          ].map((cat) => (
            <Link 
              key={cat.name} 
              to={`/collections?category=${cat.name}`} 
              className="group flex flex-col items-center cursor-pointer"
            >
              <div className="w-full aspect-[4/5] bg-black-light border border-zinc-900 mb-6 overflow-hidden relative">
                {cat.img && (
                  <img loading="lazy" 
                    src={cat.img} 
                    alt={cat.name} 
                    className="w-full h-full object-cover opacity-80 group-hover:scale-105 group-hover:opacity-100 transition-all duration-700"
                  />
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black-rich/50 to-transparent"></div>
              </div>
              <h3 className="text-sm font-serif tracking-widest uppercase text-white mb-2">{cat.name}</h3>
              <span className="text-[9px] text-zinc-500 group-hover:text-primary transition-colors tracking-widest uppercase font-bold flex items-center gap-1">
                Shop Now <ArrowRight size={10} />
              </span>
            </Link>
          ))}
        </div>
        

      </section>

      {/* New Arrivals Row */}
      <section className="py-12 max-w-[1400px] mx-auto px-6">
        <div className="flex justify-between items-end mb-10 border-b border-zinc-900 pb-4">
          <span className="text-[10px] text-zinc-400 uppercase tracking-[0.4em] font-bold">New Arrivals</span>
          <Link to="/new-arrivals" className="text-[9px] text-white hover:text-primary transition-colors uppercase tracking-[0.2em] font-bold flex items-center gap-2">
            View All <ArrowRight size={12} />
          </Link>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {loading ? (
            <div className="col-span-full text-center py-20 text-zinc-500 text-sm">Loading...</div>
          ) : newArrivals.length === 0 ? (
            <div className="col-span-full text-center py-20 text-zinc-500 text-sm">No new arrivals found.</div>
          ) : (
            newArrivals.map((product) => {
              const hasStock = Object.values(product.sizes || {}).some(qty => (qty as number) > 0);
              return (
                <div key={product.id} className="group cursor-pointer" onClick={() => setSelectedProduct(product)}>
                  <div className="relative aspect-[3/4] bg-black-light mb-4 overflow-hidden border border-zinc-900 group-hover:border-zinc-700 transition-colors">
                    {product.images?.[0] && (
                      <img loading="lazy" src={product.images[0]} alt={product.name} className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity" />
                    )}
                    <button className="absolute top-3 right-3 text-zinc-400 hover:text-primary transition-colors z-10" onClick={(e) => { e.stopPropagation(); /* Add to wishlist logic */ }}>
                      <Heart size={16} strokeWidth={1.5} />
                    </button>
                    {!hasStock && (
                      <div className="absolute inset-0 bg-black/60 flex items-center justify-center backdrop-blur-[2px]">
                        <span className="bg-red-600 text-white font-bold uppercase tracking-widest px-3 py-1 text-[10px] border border-red-400">Sold Out</span>
                      </div>
                    )}
                    {product.sale_price && (
                      <span className="absolute top-3 left-3 bg-primary text-white text-[9px] font-bold tracking-widest uppercase px-2 py-1">
                        Sale
                      </span>
                    )}
                  </div>
                  <div>
                    <h4 className="text-[11px] font-bold text-zinc-300 mb-1 truncate">{product.name}</h4>
                    <p className="text-[11px] font-mono text-white mb-2">
                      {product.sale_price ? (
                        <span className="flex gap-2 items-center">
                          <span className="text-zinc-500 line-through">₹{product.price}</span>
                          <span className="text-primary">₹{product.sale_price}</span>
                        </span>
                      ) : (
                        <span>₹{product.price}</span>
                      )}
                    </p>
                    {product.colors && product.colors.length > 0 && (
                      <div className="flex gap-1.5 flex-wrap">
                        {product.colors.map(color => (
                          <div 
                            key={color} 
                            className="w-3 h-3 border border-zinc-600 rounded-full"
                            style={{ backgroundColor: color.toLowerCase() }}
                            title={color}
                          ></div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>
      </section>

      {/* Product Modal */}
      <ProductModal 
        product={selectedProduct}
        isOpen={!!selectedProduct}
        onClose={() => setSelectedProduct(null)}
      />

    </div>
  );
}
