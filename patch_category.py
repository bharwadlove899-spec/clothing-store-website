import re

with open('src/pages/admin/AddProduct.tsx', 'r') as f:
    content = f.read()

old_categories = 'const CATEGORIES = ["Traditional Wear", "Casual Wear", "Formal Wear", "Accessories", "Combos"];'
new_categories = 'const CATEGORIES = ["Shirt", "T-shirt", "Jeans", "Combo"];'

content = content.replace(old_categories, new_categories)

with open('src/pages/admin/AddProduct.tsx', 'w') as f:
    f.write(content)

