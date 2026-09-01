import re

with open('src/pages/Home.tsx', 'r') as f:
    content = f.read()

content = content.replace(
    'to="/collections"',
    'to={`/collections?category=${cat.name}`}'
)

with open('src/pages/Home.tsx', 'w') as f:
    f.write(content)

