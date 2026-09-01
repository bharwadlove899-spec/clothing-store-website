import re

with open('src/components/ProductModal.tsx', 'r') as f:
    content = f.read()

# Add import
content = content.replace('import { doc, getDoc } from "firebase/firestore";', 'import { getCachedStoreSettings } from "../lib/cache";')
content = content.replace('import { db } from "../lib/firebase";\n', '')

# Replace fetchSettings
old_fetch = """    // Fetch whatsapp number from settings
    const fetchSettings = async () => {
      try {
        const snap = await getDoc(doc(db, 'settings', 'store_settings'));
        if (snap.exists() && snap.data().whatsapp) {
          setWhatsappNumber(snap.data().whatsapp);
        }
      } catch (e) {
        console.error(e);
      }
    };"""

new_fetch = """    // Fetch whatsapp number from settings
    const fetchSettings = async () => {
      try {
        const data = await getCachedStoreSettings();
        if (data && data.whatsapp) {
          setWhatsappNumber(data.whatsapp);
        }
      } catch (e) {
        console.error(e);
      }
    };"""

content = content.replace(old_fetch, new_fetch)

with open('src/components/ProductModal.tsx', 'w') as f:
    f.write(content)
