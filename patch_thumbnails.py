import re

with open('src/components/ProductModal.tsx', 'r') as f:
    content = f.read()

indicators = """                {/* Indicators */}
                {product.images && product.images.length > 1 && (
                  <div className="absolute bottom-4 left-0 right-0 flex flex-col items-center gap-2 pointer-events-none z-10">
                    <span className="bg-black/60 text-white text-[10px] font-mono px-2 py-0.5 rounded-sm backdrop-blur-sm">
                      {currentImageIndex + 1} / {product.images.length}
                    </span>
                    <div className="flex justify-center gap-1.5">
                      {product.images.map((_, idx) => (
                        <div key={idx} className={`w-1.5 h-1.5 rounded-full transition-colors ${currentImageIndex === idx ? 'bg-white' : 'bg-white/40'}`} />
                      ))}
                    </div>
                  </div>
                )}"""

indicators_new = """                {/* Indicators - Mobile */}
                {product.images && product.images.length > 1 && (
                  <div className="absolute bottom-4 left-0 right-0 flex flex-col items-center gap-2 pointer-events-none z-10 md:hidden">
                    <span className="bg-black/60 text-white text-[10px] font-mono px-2 py-0.5 rounded-sm backdrop-blur-sm">
                      {currentImageIndex + 1} / {product.images.length}
                    </span>
                    <div className="flex justify-center gap-1.5">
                      {product.images.map((_, idx) => (
                        <div key={idx} className={`w-1.5 h-1.5 rounded-full transition-colors ${currentImageIndex === idx ? 'bg-white' : 'bg-white/40'}`} />
                      ))}
                    </div>
                  </div>
                )}
                
                {/* Thumbnails - Desktop */}
                {product.images && product.images.length > 1 && (
                  <div className="absolute bottom-4 left-0 right-0 hidden md:flex justify-center gap-2 z-10 px-4">
                    {product.images.map((img, idx) => (
                      <button 
                        key={idx} 
                        onClick={(e) => { e.stopPropagation(); setCurrentImageIndex(idx); }}
                        className={`w-12 h-16 rounded-sm overflow-hidden border-2 transition-colors ${currentImageIndex === idx ? 'border-primary' : 'border-transparent opacity-60 hover:opacity-100'}`}
                      >
                        <img src={img} alt={`Thumbnail ${idx+1}`} className="w-full h-full object-cover" />
                      </button>
                    ))}
                  </div>
                )}"""
content = content.replace(indicators, indicators_new)

with open('src/components/ProductModal.tsx', 'w') as f:
    f.write(content)

