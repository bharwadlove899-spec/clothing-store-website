import re
with open('src/pages/admin/AddProduct.tsx', 'r') as f:
    content = f.read()

content = content.replace("import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';\n", "")
content = content.replace("import { storage } from '../../lib/firebase';\n", "")

with open('src/pages/admin/AddProduct.tsx', 'w') as f:
    f.write(content)
