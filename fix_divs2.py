import re

with open('src/components/ProductModal.tsx', 'r') as f:
    content = f.read()

content = content.replace("</div>\n          {/* Full Screen Image Viewer */}", "</motion.div>\n          {/* Full Screen Image Viewer */}")
content = content.replace("</>\\n      )}\\n    </AnimatePresence>", "</motion.div>\\n        </>\\n      )}\\n    </AnimatePresence>")

with open('src/components/ProductModal.tsx', 'w') as f:
    f.write(content)

