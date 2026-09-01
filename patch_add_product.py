import re

with open('src/pages/admin/AddProduct.tsx', 'r') as f:
    content = f.read()

# Default sizes state
old_sizes_state = """  const [sizes, setSizes] = useState<Record<string, number>>({
    XS: 0, S: 0, M: 0, L: 0, XL: 0, XXL: 0, XXXL: 0
  });"""
new_sizes_state = """  const [sizes, setSizes] = useState<Record<string, number>>({
    XS: 0, S: 0, M: 0, L: 0, XL: 0, XXL: 0, XXXL: 0,
    "28": 0, "30": 0, "32": 0, "34": 0, "36": 0, "38": 0
  });"""
content = content.replace(old_sizes_state, new_sizes_state)

# Filter sizes based on category before rendering
old_sizes_render = """            {Object.entries(sizes).map(([size, qty]) => (
              <div key={size} className="flex flex-col">
                <label className="text-xs font-bold uppercase text-zinc-500 mb-1">Size {size}</label>"""

new_sizes_render = """            {Object.entries(sizes).filter(([size]) => {
              const isJeansSize = ['28', '30', '32', '34', '36', '38'].includes(size);
              if (formData.category === 'Jeans') return isJeansSize;
              if (formData.category === 'Combo') return true; // Show both
              return !isJeansSize;
            }).map(([size, qty]) => (
              <div key={size} className="flex flex-col">
                <label className="text-xs font-bold uppercase text-zinc-500 mb-1">{['28', '30', '32', '34', '36', '38'].includes(size) ? 'Jeans' : 'Top'} Size {size}</label>"""
content = content.replace(old_sizes_render, new_sizes_render)

# Filter sizes on submit
old_submit_payload = """        images: formData.images,
        colors: formData.colors,
        sizes,
        is_active: formData.is_active,"""

new_submit_payload = """        images: formData.images,
        colors: formData.colors,
        sizes: Object.fromEntries(
          Object.entries(sizes).filter(([size]) => {
            const isJeansSize = ['28', '30', '32', '34', '36', '38'].includes(size);
            if (formData.category === 'Jeans') return isJeansSize;
            if (formData.category === 'Combo') return true;
            return !isJeansSize;
          })
        ),
        is_active: formData.is_active,"""
content = content.replace(old_submit_payload, new_submit_payload)

with open('src/pages/admin/AddProduct.tsx', 'w') as f:
    f.write(content)

