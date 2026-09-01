import { motion } from "motion/react";
import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import ProductModal from "../components/ProductModal";
import { getCachedNewArrivals } from "../lib/cache";
import { Product } from "../types";

export default function NewArrivals() {
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const data = await getCachedNewArrivals();
        setProducts(data);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  return (
    <div className="w-full bg-black-rich min-h-screen pt-12 pb-24">
      <div className="max-w-7xl mx-auto px-6">
        
        <div className="mb-12">
          <h1 className="text-4xl font-serif text-white mb-4">New Arrivals</h1>
        </div>

        {loading ? (
          <div className="text-center py-20 text-zinc-500">Loading new arrivals...</div>
        ) : products.length === 0 ? (
          <div className="text-center py-20 text-zinc-500">No new arrivals found.</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {products.map((product, index) => {
              const hasStock = Object.values(product.sizes || {}).some(qty => (qty as number) > 0);

              return (
                <motion.div 
                  key={product.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="group cursor-pointer"
                  onClick={() => setSelectedProduct(product)}
                >
                  <div className="relative aspect-[3/4] bg-black-light mb-4 overflow-hidden border border-zinc-900 group-hover:border-zinc-700 transition-colors">
                    {product.images?.[0] && (
                      <img loading="lazy" src={product.images[0]} alt={product.name} className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity" />
                    )}
                    
                    <span className="absolute top-4 left-4 bg-white text-black text-[9px] font-bold tracking-widest uppercase px-2 py-1">
                      New
                    </span>

                    {!hasStock && (
                      <div className="absolute inset-0 bg-black/50 flex items-center justify-center backdrop-blur-sm">
                        <span className="bg-red-600 text-white font-bold uppercase tracking-widest px-4 py-1 text-xs border border-red-400">Sold Out</span>
                      </div>
                    )}
                    
                    <div className="absolute inset-x-0 bottom-0 p-4 opacity-0 group-hover:opacity-100 transition-opacity flex justify-center bg-gradient-to-t from-black/80 to-transparent">
                      <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedProduct(product);
                        }}
                        className="bg-primary text-white w-full py-3 text-[10px] font-bold tracking-widest uppercase hover:bg-primary-dark transition-colors"
                      >
                        View Details
                      </button>
                    </div>
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-white mb-1 truncate group-hover:text-primary transition-colors">{product.name}</h3>
                    <div className="flex justify-between items-center">
                      <p className="text-[10px] text-zinc-500 uppercase tracking-widest truncate">{product.category}</p>
                      <p className="text-sm font-mono text-white">
                        ₹{product.sale_price || product.price}
                      </p>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}

        <div className="mt-16 flex justify-center">
          <Link 
            to="/collections" 
            className="border border-zinc-800 text-white px-8 py-4 text-[10px] font-bold uppercase tracking-widest hover:bg-white hover:text-black transition-colors"
          >
            View All Collections
          </Link>
        </div>
      </div>

      <ProductModal 
        product={selectedProduct}
        isOpen={!!selectedProduct}
        onClose={() => setSelectedProduct(null)}
      />
    </div>
  );
}
