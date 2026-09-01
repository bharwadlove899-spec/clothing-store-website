import { motion } from "motion/react";
import { Link, useSearchParams } from "react-router-dom";
import { Filter } from "lucide-react";
import React, { useState, useEffect } from "react";
import ProductModal from "../components/ProductModal";
import { getCachedProducts } from "../lib/cache";
import { Product } from "../types";

export default function Collections() {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialCategory = searchParams.get("category") || "All";
  
  const [activeCategory, setActiveCategory] = useState(initialCategory);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [categories, setCategories] = useState<string[]>(["All"]);
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    const cat = searchParams.get("category");
    if (cat) {
      setActiveCategory(cat);
    } else {
      setActiveCategory("All");
    }
    setCurrentPage(1);
  }, [searchParams]);

  const handleCategoryClick = (cat: string) => {
    setActiveCategory(cat);
    setCurrentPage(1);
    if (cat === "All") {
      setSearchParams({});
    } else {
      setSearchParams({ category: cat });
    }
  };

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const data = await getCachedProducts();
        setProducts(data);
        
        // Extract unique categories
        const cats = new Set(data.map(p => p.category));
        setCategories(["All", ...Array.from(cats)]);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  const filteredProducts = activeCategory === "All" 
    ? products 
    : products.filter(p => p.category === activeCategory);

  const itemsPerPage = activeCategory === "Combo" ? 6 : 8;
  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);
  
  const displayedProducts = filteredProducts.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <div className="w-full bg-black-rich min-h-screen pt-12 pb-24">
      <div className="max-w-7xl mx-auto px-6">
        
        <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-6">
          <div>
            <h1 className="text-4xl font-serif text-white mb-4">Collections</h1>
          </div>
          
          <div className="flex items-center gap-2 overflow-x-auto w-full md:w-auto pb-2 scrollbar-none">
            <Filter size={16} className="text-zinc-500 mr-2 shrink-0" />
            {categories.map(cat => (
              <button 
                key={cat}
                onClick={() => handleCategoryClick(cat)}
                className={`px-4 py-2 text-[10px] uppercase tracking-widest font-bold whitespace-nowrap transition-colors ${
                  activeCategory === cat 
                    ? "bg-white text-black" 
                    : "text-zinc-400 hover:text-white border border-zinc-800"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {loading ? (
          <div className="text-center py-20 text-zinc-500">Loading collections...</div>
        ) : filteredProducts.length === 0 ? (
          <div className="text-center py-20 text-zinc-500">No products found in this category.</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {displayedProducts.map((product, index) => {
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
                    
                    {product.sale_price && (
                      <span className="absolute top-4 left-4 bg-primary text-white text-[9px] font-bold tracking-widest uppercase px-2 py-1">
                        Sale
                      </span>
                    )}

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
                        className="bg-white text-black w-full py-3 text-[10px] font-bold tracking-widest uppercase hover:bg-neutral-200 transition-colors"
                      >
                        View Details
                      </button>
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between items-start mb-1">
                      <h3 className="text-sm font-bold text-white group-hover:text-primary transition-colors">{product.name}</h3>
                      <div className="text-right">
                        {product.sale_price ? (
                          <>
                            <span className="text-xs font-mono text-zinc-500 line-through mr-2">₹{product.price}</span>
                            <span className="text-sm font-mono text-white">₹{product.sale_price}</span>
                          </>
                        ) : (
                          <span className="text-sm font-mono text-white">₹{product.price}</span>
                        )}
                      </div>
                    </div>
                    <p className="text-[10px] text-zinc-500 uppercase tracking-widest">{product.category}</p>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}

        {totalPages > 1 && (
          <div className="mt-16 flex flex-wrap justify-center items-center gap-2">
            {Array.from({ length: totalPages }).map((_, i) => (
              <button
                key={i}
                onClick={() => {
                  setCurrentPage(i + 1);
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className={`px-4 h-10 flex items-center justify-center text-[10px] uppercase tracking-widest font-bold transition-colors ${
                  currentPage === i + 1
                    ? "bg-white text-black"
                    : "text-zinc-400 hover:text-white border border-zinc-800"
                }`}
              >
                Page {i + 1}
              </button>
            ))}
          </div>
        )}
        
      </div>

      <ProductModal 
        product={selectedProduct}
        isOpen={!!selectedProduct}
        onClose={() => setSelectedProduct(null)}
      />
    </div>
  );
}
