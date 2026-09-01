import re

with open('src/components/ProductModal.tsx', 'r') as f:
    content = f.read()

content = re.sub(r'</div>\s*{\/\* Full Screen Image Viewer \*\/}', r'</motion.div>\n          {/* Full Screen Image Viewer */}', content)

with open('src/components/ProductModal.tsx', 'w') as f:
    f.write(content)

