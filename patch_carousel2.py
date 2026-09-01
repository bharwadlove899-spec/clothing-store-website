import re

with open('src/components/ProductModal.tsx', 'r') as f:
    content = f.read()

bad_carousel = """                <div 
                  className="w-full h-full flex overflow-x-auto snap-x snap-mandatory scrollbar-none scroll-smooth"
                  onScroll={(e) => {
                    const scrollLeft = (e.target as HTMLDivElement).scrollLeft;
                    const width = (e.target as HTMLDivElement).clientWidth;
                    const newIndex = Math.round(scrollLeft / width);
                    if (newIndex !== currentImageIndex) setCurrentImageIndex(newIndex);
                  }}
                  ref={(el) => {
                    if (el) {
                       el.scrollTo({ left: currentImageIndex * el.clientWidth, behavior: 'smooth' });
                    }
                  }}
                  onClick={() => setIsFullScreenImage(true)}
                >
                  {product.images?.map((img, idx) => (
                    <div key={idx} className="w-full h-full flex-shrink-0 relative">"""

good_carousel = """                <div 
                  id="image-scroll-container"
                  className="w-full h-full flex overflow-x-auto snap-x snap-mandatory scrollbar-none scroll-smooth"
                  onScroll={(e) => {
                    const scrollLeft = (e.target as HTMLDivElement).scrollLeft;
                    const width = (e.target as HTMLDivElement).clientWidth;
                    const newIndex = Math.round(scrollLeft / width);
                    if (newIndex !== currentImageIndex) setCurrentImageIndex(newIndex);
                  }}
                  onClick={() => setIsFullScreenImage(true)}
                >
                  {product.images?.map((img, idx) => (
                    <div key={idx} className="w-full h-full flex-shrink-0 snap-start relative">"""

content = content.replace(bad_carousel, good_carousel)


# Then add useEffect to handle external index changes
use_effect_code = """  useEffect(() => {
    const el = document.getElementById('image-scroll-container');
    if (el) {
      el.scrollTo({ left: currentImageIndex * el.clientWidth, behavior: 'smooth' });
    }
  }, [currentImageIndex]);

  if (!product) return null;"""

content = content.replace("  if (!product) return null;", use_effect_code)


with open('src/components/ProductModal.tsx', 'w') as f:
    f.write(content)

