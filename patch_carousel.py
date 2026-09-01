import re

with open('src/components/ProductModal.tsx', 'r') as f:
    content = f.read()

bad_carousel = """                <motion.div 
                  className="w-full h-full flex"
                  drag="x"
                  dragConstraints={{ left: 0, right: 0 }}
                  dragElastic={0.2}
                  onDragEnd={(e, { offset, velocity }) => {
                    const swipe = offset.x;
                    if (swipe < -50) {
                      setCurrentImageIndex(prev => Math.min((product.images?.length || 1) - 1, prev + 1));
                    } else if (swipe > 50) {
                      setCurrentImageIndex(prev => Math.max(0, prev - 1));
                    }
                  }}
                  animate={{ x: `-${currentImageIndex * 100}%` }}
                  transition={{ type: "spring", stiffness: 300, damping: 30 }}
                  onClick={() => setIsFullScreenImage(true)}
                >"""

good_carousel = """                <div 
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
                >"""

content = content.replace(bad_carousel, good_carousel)

with open('src/components/ProductModal.tsx', 'w') as f:
    f.write(content)

