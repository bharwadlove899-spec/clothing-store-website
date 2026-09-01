import re

with open('src/pages/admin/AddProduct.tsx', 'r') as f:
    content = f.read()

# Make the input accept multiple
input_old = """            <input 
              id="file-upload" 
              type="file" 
              accept="image/*" 
              className="hidden" 
              onChange={(e) => {
                if (e.target.files && e.target.files[0]) {
                  processImageFile(e.target.files[0]);
                }
                e.target.value = '';
              }} 
            />"""

input_new = """            <input 
              id="file-upload" 
              type="file" 
              accept="image/*" 
              multiple
              className="hidden" 
              onChange={(e) => {
                if (e.target.files && e.target.files.length > 0) {
                  Array.from(e.target.files).forEach(file => processImageFile(file));
                }
                e.target.value = '';
              }} 
            />"""
content = content.replace(input_old, input_new)

# Make the drop accept multiple
drop_old = """            onDrop={(e) => {
              e.preventDefault();
              if (e.dataTransfer.files && e.dataTransfer.files[0]) {
                processImageFile(e.dataTransfer.files[0]);
              }
            }}"""
drop_new = """            onDrop={(e) => {
              e.preventDefault();
              if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
                Array.from(e.dataTransfer.files).forEach(file => processImageFile(file));
              }
            }}"""
content = content.replace(drop_old, drop_new)

# Add make primary / reorder
grid_old = """          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
            {formData.images.map((img, i) => (
              <div key={i} className="relative group aspect-[3/4] bg-black border border-zinc-800">
                <img src={img} alt="" className="w-full h-full object-cover" />
                <button type="button" onClick={() => removeImage(i)} className="absolute top-2 right-2 bg-black/50 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-500">
                  <X size={14} />
                </button>
              </div>
            ))}
          </div>"""

grid_new = """          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
            {formData.images.map((img, i) => (
              <div key={i} className="relative group aspect-[3/4] bg-black border border-zinc-800 flex flex-col overflow-hidden">
                <img src={img} alt="" className="w-full h-full object-cover" />
                {i === 0 && (
                  <div className="absolute top-2 left-2 bg-primary text-white text-[9px] font-bold px-2 py-0.5 rounded shadow-sm">
                    PRIMARY
                  </div>
                )}
                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-between p-2">
                  <div className="flex justify-end">
                    <button type="button" onClick={() => removeImage(i)} className="bg-red-500 text-white p-1 rounded-full hover:bg-red-600">
                      <X size={14} />
                    </button>
                  </div>
                  <div className="flex justify-between items-end">
                    <div className="flex gap-1">
                      {i > 0 && (
                        <button type="button" onClick={() => {
                          const newImages = [...formData.images];
                          [newImages[i - 1], newImages[i]] = [newImages[i], newImages[i - 1]];
                          setFormData(prev => ({ ...prev, images: newImages }));
                        }} className="bg-zinc-800 text-white text-xs px-2 py-1 rounded hover:bg-zinc-700">&larr;</button>
                      )}
                      {i < formData.images.length - 1 && (
                        <button type="button" onClick={() => {
                          const newImages = [...formData.images];
                          [newImages[i + 1], newImages[i]] = [newImages[i], newImages[i + 1]];
                          setFormData(prev => ({ ...prev, images: newImages }));
                        }} className="bg-zinc-800 text-white text-xs px-2 py-1 rounded hover:bg-zinc-700">&rarr;</button>
                      )}
                    </div>
                    {i > 0 && (
                      <button type="button" onClick={() => {
                        const newImages = [...formData.images];
                        const imgToMove = newImages.splice(i, 1)[0];
                        newImages.unshift(imgToMove);
                        setFormData(prev => ({ ...prev, images: newImages }));
                      }} className="bg-zinc-800 text-white text-[9px] px-2 py-1 rounded hover:bg-zinc-700">Make Primary</button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>"""
content = content.replace(grid_old, grid_new)

with open('src/pages/admin/AddProduct.tsx', 'w') as f:
    f.write(content)

