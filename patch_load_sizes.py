import re

with open('src/pages/admin/AddProduct.tsx', 'r') as f:
    content = f.read()

old_load = """            if (data.sizes) {
              setSizes(data.sizes);
            }"""

new_load = """            if (data.sizes) {
              setSizes(prev => ({ ...prev, ...data.sizes }));
            }"""

content = content.replace(old_load, new_load)

with open('src/pages/admin/AddProduct.tsx', 'w') as f:
    f.write(content)

