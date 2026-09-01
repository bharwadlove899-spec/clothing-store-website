import re

with open('src/pages/admin/AddProduct.tsx', 'r') as f:
    content = f.read()

bad_upload = """        const ctx = canvas.getContext('2d');
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

good_upload = """        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.drawImage(img, 0, 0, width, height);
          const dataUrl = canvas.toDataURL('image/webp', 0.7);
          setFormData(prev => ({ ...prev, images: [...prev.images, dataUrl] }));
        }"""

content = content.replace(bad_upload, good_upload)

with open('src/pages/admin/AddProduct.tsx', 'w') as f:
    f.write(content)

