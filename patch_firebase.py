import re

with open('src/lib/firebase.ts', 'r') as f:
    content = f.read()

content = content.replace("import { getAuth } from 'firebase/auth';", "import { getAuth } from 'firebase/auth';\nimport { getStorage } from 'firebase/storage';")

content = content.replace("export const auth = getAuth(app);", "export const auth = getAuth(app);\nexport const storage = getStorage(app);")

with open('src/lib/firebase.ts', 'w') as f:
    f.write(content)
