import re

with open('src/pages/Home.tsx', 'r') as f:
    content = f.read()

# Remove state
content = content.replace("const [showAllCategories, setShowAllCategories] = useState(false);\n  const [newArrivals, setNewArrivals] = useState<Product[]>([]);", "const [newArrivals, setNewArrivals] = useState<Product[]>([]);")

# Revert grid classes
content = content.replace('<div className={`grid grid-cols-2 ${showAllCategories ? "md:grid-cols-4" : "md:grid-cols-2 max-w-2xl mx-auto"} gap-4 md:gap-6`}>', '<div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">')

# Revert map
old_map = """          {[
            { name: "Shirt", img: "/category-shirt.jpg" },
            { name: "T-shirt", img: "/category-tshirt.jpg" },
            { name: "Jeans", img: "/category-jeans.jpg" },
            { name: "Combo", img: "/category-combos.jpg" },
          ].slice(0, showAllCategories ? 4 : 2).map((cat) => ("""
new_map = """          {[
            { name: "Shirt", img: "/category-shirt.jpg" },
            { name: "T-shirt", img: "/category-tshirt.jpg" },
            { name: "Jeans", img: "/category-jeans.jpg" },
            { name: "Combo", img: "/category-combos.jpg" },
          ].map((cat) => ("""
content = content.replace(old_map, new_map)

# Remove the show more button block
button_block_start = "        {!showAllCategories ? ("
button_block = """        {!showAllCategories ? (
          <div className="mt-12 flex justify-center">
            <button 
              onClick={() => setShowAllCategories(true)}
              className="text-[10px] text-white border border-zinc-800 hover:border-zinc-500 px-8 py-3 uppercase tracking-widest font-bold transition-colors flex items-center gap-2"
            >
              Show More Categories
            </button>
          </div>
        ) : (
          <div className="mt-12 flex justify-center">
            <button 
              onClick={() => setShowAllCategories(false)}
              className="text-[10px] text-zinc-500 hover:text-white px-8 py-3 uppercase tracking-widest font-bold transition-colors"
            >
              Show Less
            </button>
          </div>
        )}"""
content = content.replace(button_block, "")

with open('src/pages/Home.tsx', 'w') as f:
    f.write(content)
