import re

with open('src/components/ProductModal.tsx', 'r') as f:
    content = f.read()

use_effect_code = """  useEffect(() => {
    const el = document.getElementById('image-scroll-container');
    if (el) {
      el.scrollTo({ left: currentImageIndex * el.clientWidth, behavior: 'smooth' });
    }
  }, [currentImageIndex]);"""

better_effect_code = """  useEffect(() => {
    const el = document.getElementById('image-scroll-container');
    if (el) {
      const targetLeft = currentImageIndex * el.clientWidth;
      if (Math.abs(el.scrollLeft - targetLeft) > 5) {
        el.scrollTo({ left: targetLeft, behavior: 'smooth' });
      }
    }
  }, [currentImageIndex]);"""

content = content.replace(use_effect_code, better_effect_code)

# Ensure overflow-y is hidden on the image section
content = content.replace('group overflow-hidden"', 'group overflow-hidden flex"')

with open('src/components/ProductModal.tsx', 'w') as f:
    f.write(content)

