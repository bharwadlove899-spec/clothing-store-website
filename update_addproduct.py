import re

with open('src/pages/admin/AddProduct.tsx', 'r') as f:
    content = f.read()

# Add imports for storage
import_old = "import { collection, addDoc, doc, getDoc, updateDoc, Timestamp } from 'firebase/firestore';"
import_new = "import { collection, addDoc, doc, getDoc, updateDoc, Timestamp } from 'firebase/firestore';\nimport { ref, uploadBytes, getDownloadURL } from 'firebase/storage';\nimport { storage } from '../../lib/firebase';"
if import_old in content:
    content = content.replace(import_old, import_new)
else:
    # Try another pattern
    import_old = "import { db } from '../../lib/firebase';"
    import_new = "import { db, storage } from '../../lib/firebase';\nimport { ref, uploadBytes, getDownloadURL } from 'firebase/storage';"
    content = content.replace(import_old, import_new)


process_old = """        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.drawImage(img, 0, 0, width, height);
          const dataUrl = canvas.toDataURL('image/webp', 0.8);
          setFormData(prev => ({ ...prev, images: [...prev.images, dataUrl] }));
        }"""
        
process_new = """        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.drawImage(img, 0, 0, width, height);
          canvas.toBlob(async (blob) => {
            if (blob) {
              setLoading(true);
              try {
                const fileName = `products/${Date.now()}_${Math.random().toString(36).substring(7)}.webp`;
                const storageRef = ref(storage, fileName);
                await uploadBytes(storageRef, blob);
                const downloadURL = await getDownloadURL(storageRef);
                setFormData(prev => ({ ...prev, images: [...prev.images, downloadURL] }));
              } catch (err) {
                console.error("Error uploading image:", err);
                setError("Failed to upload image to Storage");
              } finally {
                setLoading(false);
              }
            }
          }, 'image/webp', 0.8);
        }"""
content = content.replace(process_old, process_new)

with open('src/pages/admin/AddProduct.tsx', 'w') as f:
    f.write(content)
