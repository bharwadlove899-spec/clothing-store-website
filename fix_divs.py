with open('src/components/ProductModal.tsx', 'r') as f:
    content = f.read()

bad1 = """                  </div>
                </div>
              </div>
            </div>
          </div>
          {/* Full Screen Image Viewer */}"""

good1 = """                  </div>
                </div>
              </div>
            </div>
          </motion.div>
          {/* Full Screen Image Viewer */}"""

bad2 = """                <motion.img 
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0.9, opacity: 0 }}
                  src={product.images[currentImageIndex]} 
                  alt={product.name} 
                  className="max-w-full max-h-full object-contain rounded-md"
                  onClick={(e) => e.stopPropagation()}
                />
              </div>
            )}
          </AnimatePresence>"""

good2 = """                <motion.img 
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0.9, opacity: 0 }}
                  src={product.images[currentImageIndex]} 
                  alt={product.name} 
                  className="max-w-full max-h-full object-contain rounded-md"
                  onClick={(e) => e.stopPropagation()}
                />
              </motion.div>
            )}
          </AnimatePresence>"""

content = content.replace(bad1, good1)
content = content.replace(bad2, good2)

with open('src/components/ProductModal.tsx', 'w') as f:
    f.write(content)

