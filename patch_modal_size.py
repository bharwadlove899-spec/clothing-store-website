import re

with open('src/components/ProductModal.tsx', 'r') as f:
    content = f.read()

old_block = """                    <div className="flex flex-wrap gap-2">
                      {Object.entries(sizes).map(([size, qty]) => {
                        const isOutOfStock = qty === 0;
                        return (
                          <button
                            key={size}
                            onClick={() => !isOutOfStock && setSelectedSize(size)}
                            disabled={isOutOfStock}
                            className={`w-10 h-10 md:w-12 md:h-12 flex items-center justify-center border text-xs font-mono transition-colors relative ${
                              selectedSize === size 
                                ? "border-primary text-white bg-primary/10" 
                                : isOutOfStock
                                  ? "border-zinc-800 text-zinc-700 cursor-not-allowed"
                                  : "border-zinc-800 text-zinc-400 hover:border-zinc-500 hover:text-white"
                            }`}
                          >
                            {size}
                            {isOutOfStock && (
                              <div className="absolute inset-0 border-t border-zinc-800 rotate-45 transform origin-center top-1/2 -mt-[1px]" />
                            )}
                          </button>
                        );
                      })}
                    </div>"""

new_block = """                    <div className="flex flex-wrap gap-3 md:gap-4">
                      {Object.entries(sizes).map(([size, qty]) => {
                        const isOutOfStock = qty === 0;
                        return (
                          <div key={size} className="flex flex-col items-center gap-1">
                            <button
                              onClick={() => !isOutOfStock && setSelectedSize(size)}
                              disabled={isOutOfStock}
                              className={`w-10 h-10 md:w-12 md:h-12 flex items-center justify-center border text-xs font-mono transition-colors relative ${
                                selectedSize === size 
                                  ? "border-primary text-white bg-primary/10" 
                                  : isOutOfStock
                                    ? "border-zinc-800 text-zinc-700 cursor-not-allowed"
                                    : "border-zinc-800 text-zinc-400 hover:border-zinc-500 hover:text-white"
                              }`}
                            >
                              {size}
                              {isOutOfStock && (
                                <div className="absolute inset-0 border-t border-zinc-800 rotate-45 transform origin-center top-1/2 -mt-[1px]" />
                              )}
                            </button>
                            {isOutOfStock && (
                              <span className="text-[8px] text-red-500/80 uppercase tracking-widest font-bold text-center">Sold Out</span>
                            )}
                          </div>
                        );
                      })}
                    </div>"""

content = content.replace(old_block, new_block)

with open('src/components/ProductModal.tsx', 'w') as f:
    f.write(content)
