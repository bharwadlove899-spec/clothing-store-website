import re

with open('src/components/ProductModal.tsx', 'r') as f:
    content = f.read()

# 1. Add state
old_state = 'const [selectedSize, setSelectedSize] = useState<string>("");'
new_state = 'const [selectedSize, setSelectedSize] = useState<string>("");\n  const [selectedJeansSize, setSelectedJeansSize] = useState<string>("");'
content = content.replace(old_state, new_state)

# 1.5 reset jeans size
old_reset = 'setSelectedSize(firstAvailable || "");'
new_reset = 'setSelectedSize(firstAvailable || "");\n      setSelectedJeansSize("");'
content = content.replace(old_reset, new_reset)

# 2. Modify text
old_text = 'const text = `Hi, I\'m interested in buying: ${product.name}\\nPrice: ${priceStr}\\nSize: ${selectedSize}${colorStr}${addressStr}${mobileStr}`;'
new_text = '''const jeansSizeStr = (product.category === 'Combo' && selectedJeansSize) ? `\\nJeans Size: ${selectedJeansSize}` : "";
  const sizeLabel = product.category === 'Combo' ? 'Top Size' : 'Size';
  const text = `Hi, I'm interested in buying: ${product.name}\\nPrice: ${priceStr}\\n${sizeLabel}: ${selectedSize}${jeansSizeStr}${colorStr}${addressStr}${mobileStr}`;'''
content = content.replace(old_text, new_text)

# 3. Modify handleBuy
old_buy = """  const handleBuy = (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (!selectedSize) {
      e.preventDefault();
      alert("Please select a size first.");
      return;
    }"""
new_buy = """  const handleBuy = (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (!selectedSize) {
      e.preventDefault();
      alert("Please select a size first.");
      return;
    }
    if (product.category === 'Combo' && !selectedJeansSize) {
      e.preventDefault();
      alert("Please select a jeans size.");
      return;
    }"""
content = content.replace(old_buy, new_buy)

# 4. Update UI labels and add jeans size section
old_ui_label = '<span className="text-xs text-zinc-400 uppercase tracking-widest font-bold">Select Size</span>'
new_ui_label = '<span className="text-xs text-zinc-400 uppercase tracking-widest font-bold">{product.category === \'Combo\' ? \'Select Top Size\' : \'Select Size\'}</span>'
content = content.replace(old_ui_label, new_ui_label)

old_ui_section = """                  </div>

                  {/* Delivery Details */}"""
new_ui_section = """                  </div>

                  {/* Jeans Size Selection for Combos */}
                  {product.category === 'Combo' && (
                    <div className="mb-6">
                      <div className="flex justify-between items-center mb-3">
                        <span className="text-xs text-zinc-400 uppercase tracking-widest font-bold">Select Jeans Size</span>
                      </div>
                      <div className="flex flex-wrap gap-3 md:gap-4">
                        {['28', '30', '32', '34', '36', '38'].map((size) => (
                          <div key={size} className="flex flex-col items-center gap-1">
                            <button
                              onClick={() => setSelectedJeansSize(size)}
                              className={`w-10 h-10 md:w-12 md:h-12 flex items-center justify-center border text-xs font-mono transition-colors relative ${
                                selectedJeansSize === size 
                                  ? "border-primary text-white bg-primary/10" 
                                  : "border-zinc-800 text-zinc-400 hover:border-zinc-500 hover:text-white"
                              }`}
                            >
                              {size}
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Delivery Details */}"""
content = content.replace(old_ui_section, new_ui_section)

with open('src/components/ProductModal.tsx', 'w') as f:
    f.write(content)
