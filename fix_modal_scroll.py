with open('src/components/ProductModal.tsx', 'r') as f:
    content = f.read()

# 1. Parent container
old_parent = 'className="bg-black-light border border-zinc-800 w-full max-w-4xl max-h-[90vh] md:h-[600px] flex flex-col md:flex-row relative shadow-2xl overflow-hidden rounded-md"'
new_parent = 'className="bg-black-light border border-zinc-800 w-full max-w-4xl max-h-[90vh] md:h-[600px] flex flex-col md:flex-row relative shadow-2xl overflow-y-auto md:overflow-hidden rounded-md"'
content = content.replace(old_parent, new_parent)

# 2. Image section
old_image = 'className="w-full md:w-1/2 h-[40vh] md:h-full relative flex-shrink-0 bg-black cursor-pointer group overflow-hidden flex"'
new_image = 'className="w-full md:w-1/2 h-[55vh] md:h-full relative flex-shrink-0 bg-black cursor-pointer group overflow-hidden flex"'
content = content.replace(old_image, new_image)

# 3. Details section
old_details = 'className="w-full md:w-1/2 flex flex-col bg-black-light overflow-y-auto h-[50vh] md:h-full"'
new_details = 'className="w-full md:w-1/2 flex flex-col bg-black-light md:overflow-y-auto h-auto md:h-full"'
content = content.replace(old_details, new_details)

with open('src/components/ProductModal.tsx', 'w') as f:
    f.write(content)

