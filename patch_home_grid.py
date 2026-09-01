import re

with open('src/pages/Home.tsx', 'r') as f:
    content = f.read()

old_grid = '<div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">'
new_grid = '<div className={`grid grid-cols-2 ${showAllCategories ? "md:grid-cols-4" : "md:grid-cols-2 max-w-2xl mx-auto"} gap-4 md:gap-6`}>'
content = content.replace(old_grid, new_grid)

with open('src/pages/Home.tsx', 'w') as f:
    f.write(content)

