import { motion, AnimatePresence } from "motion/react";
import { X, ChevronLeft, ChevronRight } from "lucide-react";
import { useState, useEffect } from "react";
import { Product } from "../types";
import { getCachedStoreSettings } from "../lib/cache";

type ProductModalProps = {
  product: Product | null;
  isOpen: boolean;
  onClose: () => void;
};

export default function ProductModal({ product, isOpen, onClose }: ProductModalProps) {
  const [selectedSize, setSelectedSize] = useState<string>("");
  const [selectedJeansSize, setSelectedJeansSize] = useState<string>("");
  const [selectedColor, setSelectedColor] = useState<string>("");
  const [address, setAddress] = useState<string>("");
  const [mobileNumber, setMobileNumber] = useState<string>("");
  const [isFullScreenImage, setIsFullScreenImage] = useState(false);
  const [whatsappNumber, setWhatsappNumber] = useState("9723770286"); // Default
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    // Fetch whatsapp number from settings
    const fetchSettings = async () => {
      try {
        const data = await getCachedStoreSettings();
        if (data && data.whatsapp) {
          setWhatsappNumber(data.whatsapp);
        }
      } catch (e) {
        console.error(e);
      }
    };
    fetchSettings();
  }, []);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  useEffect(() => {
    if (product) {
      setCurrentImageIndex(0);
      // Auto-select first available size
      const firstAvailable = Object.keys(product.sizes || {}).find(size => product.sizes[size] > 0);
      setSelectedSize(firstAvailable || "");
      setSelectedJeansSize("");
      
      // Auto-select first available color
      if (product.colors && product.colors.length > 0) {
        setSelectedColor(product.colors[0]);
      } else {
        setSelectedColor("");
      }
    }
  }, [product]);

  useEffect(() => {
    const el = document.getElementById('image-scroll-container');
    if (el) {
      const targetLeft = currentImageIndex * el.clientWidth;
      if (Math.abs(el.scrollLeft - targetLeft) > 5) {
        el.scrollTo({ left: targetLeft, behavior: 'smooth' });
      }
    }
  }, [currentImageIndex]);

  if (!product) return null;

  const priceStr = product.sale_price ? `₹${product.sale_price}` : `₹${product.price}`;
  const colorStr = selectedColor ? `\nColor: ${selectedColor}` : "";
  const addressStr = address ? `\nAddress: ${address}` : "";
  const mobileStr = mobileNumber ? `\nMobile: ${mobileNumber}` : "";
  const jeansSizeStr = (product.category === 'Combo' && selectedJeansSize) ? `\nJeans Size: ${selectedJeansSize}` : "";
  const sizeLabel = product.category === 'Combo' ? 'Top Size' : 'Size';
  const text = `Hi, I'm interested in buying: ${product.name}\nPrice: ${priceStr}\n${sizeLabel}: ${selectedSize}${jeansSizeStr}${colorStr}${addressStr}${mobileStr}`;

  const isMobile = typeof window !== 'undefined' && /iPhone|iPad|iPod|Android/i.test(window.navigator.userAgent);
  
  // Ensure whatsapp number has country code for India if it's just 10 digits
  const formattedWhatsappNumber = whatsappNumber.length === 10 ? `91${whatsappNumber}` : whatsappNumber;

  // Use web.whatsapp.com for desktop computers to avoid api.whatsapp.com connection issues,
  // and use the standard wa.me for mobile devices.
  const whatsappUrl = isMobile
    ? `https://wa.me/${formattedWhatsappNumber}?text=${encodeURIComponent(text)}`
    : `https://web.whatsapp.com/send?phone=${formattedWhatsappNumber}&text=${encodeURIComponent(text)}`;

  const handleBuy = (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (!selectedSize) {
      e.preventDefault();
      alert("Please select a size first.");
      return;
    }
    if (product.category === 'Combo' && !selectedJeansSize) {
      e.preventDefault();
      alert("Please select a jeans size.");
      return;
    }
    if (product.colors && product.colors.length > 0 && !selectedColor) {
      e.preventDefault();
      alert("Please select a color first.");
      return;
    }
    if (!mobileNumber.trim()) {
      e.preventDefault();
      alert("Please enter your mobile number.");
      return;
    }
    if (!address.trim()) {
      e.preventDefault();
      alert("Please enter your delivery address.");
      return;
    }
  };

  const sizes = product.sizes || {};
  const hasAnyStock = Object.values(sizes).some(qty => qty > 0);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm"
          />

          {/* Modal Content */}
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-auto"
            onClick={onClose}
          >
            <div 
              onClick={(e) => e.stopPropagation()}
              className="bg-black-light border border-zinc-800 w-full max-w-4xl max-h-[90vh] md:h-[600px] flex flex-col md:flex-row relative shadow-2xl overflow-y-auto md:overflow-hidden rounded-md"
            >
              
              {/* Close Button */}
              <button 
                onClick={onClose}
                className="absolute top-4 right-4 z-20 p-2 bg-black/50 hover:bg-black text-white rounded-full transition-colors"
              >
                <X size={20} />
              </button>

              {/* Image Section (Fixed height on mobile, full height on desktop) */}
              <div 
                className="w-full md:w-1/2 h-[55vh] md:h-full relative flex-shrink-0 bg-black cursor-pointer group overflow-hidden flex"
              >
                <div 
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
                    <div key={idx} className="w-full h-full flex-shrink-0 snap-start relative">
                      <img loading="lazy" 
                        src={img} 
                        alt={`${product.name} - image ${idx + 1}`} 
                        className="w-full h-full object-cover transition-opacity group-hover:opacity-90 pointer-events-none"
                      />
                    </div>
                  ))}
                </div>

                {/* Desktop Navigation Arrows */}
                {product.images && product.images.length > 1 && (
                  <>
                    <button 
                      onClick={(e) => { e.stopPropagation(); setCurrentImageIndex(prev => Math.max(0, prev - 1)); }}
                      className={`absolute left-4 top-1/2 -translate-y-1/2 p-2 bg-black/50 text-white rounded-full hover:bg-black border border-zinc-800 transition-colors hidden md:flex ${currentImageIndex === 0 ? 'opacity-50 cursor-not-allowed' : ''}`}
                      disabled={currentImageIndex === 0}
                    >
                      <ChevronLeft size={20} />
                    </button>
                    <button 
                      onClick={(e) => { e.stopPropagation(); setCurrentImageIndex(prev => Math.min((product.images?.length || 1) - 1, prev + 1)); }}
                      className={`absolute right-4 top-1/2 -translate-y-1/2 p-2 bg-black/50 text-white rounded-full hover:bg-black border border-zinc-800 transition-colors hidden md:flex ${currentImageIndex === (product.images?.length || 1) - 1 ? 'opacity-50 cursor-not-allowed' : ''}`}
                      disabled={currentImageIndex === (product.images?.length || 1) - 1}
                    >
                      <ChevronRight size={20} />
                    </button>
                  </>
                )}

                {/* Indicators - Mobile */}
                {product.images && product.images.length > 1 && (
                  <div className="absolute bottom-4 left-0 right-0 flex flex-col items-center gap-2 pointer-events-none z-10 md:hidden">
                    <span className="bg-black/60 text-white text-[10px] font-mono px-2 py-0.5 rounded-sm backdrop-blur-sm">
                      {currentImageIndex + 1} / {product.images.length}
                    </span>
                    <div className="flex justify-center gap-1.5">
                      {product.images.map((_, idx) => (
                        <div key={idx} className={`w-1.5 h-1.5 rounded-full transition-colors ${currentImageIndex === idx ? 'bg-white' : 'bg-white/40'}`} />
                      ))}
                    </div>
                  </div>
                )}
                
                {/* Thumbnails - Desktop */}
                {product.images && product.images.length > 1 && (
                  <div className="absolute bottom-4 left-0 right-0 hidden md:flex justify-center gap-2 z-10 px-4">
                    {product.images.map((img, idx) => (
                      <button 
                        key={idx} 
                        onClick={(e) => { e.stopPropagation(); setCurrentImageIndex(idx); }}
                        className={`w-12 h-16 rounded-sm overflow-hidden border-2 transition-colors ${currentImageIndex === idx ? 'border-primary' : 'border-transparent opacity-60 hover:opacity-100'}`}
                      >
                        <img loading="lazy" src={img} alt={`Thumbnail ${idx+1}`} className="w-full h-full object-cover" />
                      </button>
                    ))}
                  </div>
                )}
                {product.sale_price && (
                  <span className="absolute top-4 left-4 bg-primary text-white text-[10px] font-bold tracking-widest uppercase px-3 py-1 z-10">
                    Sale
                  </span>
                )}
                {!hasAnyStock && (
                  <div className="absolute inset-0 bg-black/60 flex items-center justify-center backdrop-blur-sm z-10">
                    <span className="bg-red-600 text-white font-bold uppercase tracking-widest px-6 py-2 border border-red-400">Sold Out</span>
                  </div>
                )}
              </div>

              {/* Details Section (Scrollable) */}
              <div className="w-full md:w-1/2 flex flex-col bg-black-light md:overflow-y-auto h-auto md:h-full">
                <div className="p-6 md:p-12 flex flex-col flex-1">
                  <p className="text-[10px] text-primary font-bold uppercase tracking-wider mb-2">
                    {product.category}
                  </p>
                  <h2 className="text-2xl md:text-4xl font-serif text-white mb-4">
                    {product.name}
                  </h2>
                  
                  <div className="flex items-center gap-4 mb-6">
                    <span className={product.sale_price ? "text-zinc-500 line-through text-lg" : "text-white text-2xl font-mono"}>
                      ₹{product.price}
                    </span>
                    {product.sale_price && (
                      <span className="text-white text-2xl font-mono">
                        ₹{product.sale_price}
                      </span>
                    )}
                  </div>

                  {/* Color Selection */}
                  {product.colors && product.colors.length > 0 && (
                    <div className="mb-6">
                      <div className="flex justify-between items-center mb-3">
                        <span className="text-xs text-zinc-400 uppercase tracking-widest font-bold">Select Color</span>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {product.colors.map((color) => (
                          <button
                            key={color}
                            onClick={() => setSelectedColor(color)}
                            className={`px-3 py-1.5 md:px-4 md:py-2 flex items-center justify-center border text-xs font-mono transition-colors ${
                              selectedColor === color 
                                ? "border-primary text-white bg-primary/10" 
                                : "border-zinc-800 text-zinc-400 hover:border-zinc-500 hover:text-white"
                            }`}
                          >
                            {color}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Size Selection */}
                  <div className="mb-6">
                    <div className="flex justify-between items-center mb-3">
                      <span className="text-xs text-zinc-400 uppercase tracking-widest font-bold">{product.category === 'Combo' ? 'Select Top Size' : 'Select Size'}</span>
                    </div>
                    <div className="flex flex-wrap gap-3 md:gap-4">
                      {Object.entries(sizes).filter(([size]) => product.category !== "Combo" || !["28", "30", "32", "34", "36", "38"].includes(size)).map(([size, qty]) => {
                        const isOutOfStock = qty === 0;
                        return (
                          <div key={size} className="flex flex-col items-center gap-1">
                            <button
                              onClick={() => !isOutOfStock && setSelectedSize(size)}
                              disabled={isOutOfStock}
                              className={`w-10 h-10 md:w-12 md:h-12 flex items-center justify-center border text-xs font-mono transition-colors relative ${
                                selectedSize === size 
                                  ? "border-primary text-white bg-primary/10" 
                                  : isOutOfStock
                                    ? "border-zinc-800 text-zinc-700 cursor-not-allowed"
                                    : "border-zinc-800 text-zinc-400 hover:border-zinc-500 hover:text-white"
                              }`}
                            >
                              {size}
                              {isOutOfStock && (
                                <div className="absolute inset-0 border-t border-zinc-800 rotate-45 transform origin-center top-1/2 -mt-[1px]" />
                              )}
                            </button>
                            {isOutOfStock && (
                              <span className="text-[8px] text-red-500/80 uppercase tracking-widest font-bold text-center">Sold Out</span>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Jeans Size Selection for Combos */}
                  {product.category === 'Combo' && (
                    <div className="mb-6">
                      <div className="flex justify-between items-center mb-3">
                        <span className="text-xs text-zinc-400 uppercase tracking-widest font-bold">Select Jeans Size</span>
                      </div>
                      <div className="flex flex-wrap gap-3 md:gap-4">
                        {['28', '30', '32', '34', '36', '38'].map((size) => {
                          const qty = sizes[size] || 0;
                          const isOutOfStock = qty === 0;
                          return (
                            <div key={size} className="flex flex-col items-center gap-1">
                              <button
                                onClick={() => !isOutOfStock && setSelectedJeansSize(size)}
                                disabled={isOutOfStock}
                                className={`w-10 h-10 md:w-12 md:h-12 flex items-center justify-center border text-xs font-mono transition-colors relative ${
                                  selectedJeansSize === size 
                                    ? "border-primary text-white bg-primary/10" 
                                    : isOutOfStock
                                      ? "border-zinc-800 text-zinc-700 cursor-not-allowed"
                                      : "border-zinc-800 text-zinc-400 hover:border-zinc-500 hover:text-white"
                                }`}
                              >
                                {size}
                                {isOutOfStock && (
                                  <div className="absolute inset-0 border-t border-zinc-800 rotate-45 transform origin-center top-1/2 -mt-[1px]" />
                                )}
                              </button>
                              {isOutOfStock && (
                                <span className="text-[8px] text-red-500/80 uppercase tracking-widest font-bold text-center">Sold Out</span>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  {/* Delivery Details */}
                  <div className="mb-6 space-y-4">
                    <div>
                      <label className="block text-xs text-zinc-400 uppercase tracking-widest font-bold mb-2">Mobile Number</label>
                      <input 
                        type="tel" 
                        value={mobileNumber}
                        onChange={(e) => setMobileNumber(e.target.value)}
                        placeholder="Enter 10-digit mobile number"
                        className="w-full bg-black border border-zinc-800 text-white px-4 py-3 text-sm focus:border-primary outline-none transition-colors placeholder:text-zinc-700"
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-zinc-400 uppercase tracking-widest font-bold mb-2">Delivery Address</label>
                      <textarea 
                        value={address}
                        onChange={(e) => setAddress(e.target.value)}
                        placeholder="Enter full delivery address with pincode"
                        rows={3}
                        className="w-full bg-black border border-zinc-800 text-white px-4 py-3 text-sm focus:border-primary outline-none transition-colors placeholder:text-zinc-700 resize-none"
                      />
                    </div>
                  </div>

                  {/* Instructions Notice */}
                  <div className="mb-6 space-y-3">
                    <div className="p-3 border border-red-900/30 bg-red-900/10 rounded-md">
                      <p className="text-xs text-red-400 font-bold tracking-wide uppercase flex items-center gap-2">
                        <span>🚫</span> COD Not Available / कैश ऑन डिलीवरी उपलब्ध नहीं है
                      </p>
                    </div>
                    <div className="p-4 border border-zinc-800 bg-black/30 rounded-md">
                      <p className="text-xs text-zinc-300 leading-relaxed font-light">
                        <span className="font-bold text-primary uppercase tracking-widest text-[10px] block mb-2">📌 Notice / ध्यान दें</span>
                        जो भी प्रोडक्ट पसंद आए उसका स्क्रीनशॉट लीजिए, अपनी डिटेल्स (Mobile, Address) भरिए और नीचे दिए गए <b>Buy via WhatsApp</b> बटन पर क्लिक करें। WhatsApp में रीडायरेक्ट होने के बाद, कृपया प्रोडक्ट का स्क्रीनशॉट अटैच करके मैसेज सेंड करें।
                      </p>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex flex-col mt-auto pt-4 border-t border-zinc-800/50">
                    <a
                      href={(!hasAnyStock) ? "#" : whatsappUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={handleBuy}
                      className={`w-full py-4 text-xs font-bold uppercase tracking-widest transition-colors flex items-center justify-center gap-2 mb-4 ${
                        (!hasAnyStock || !selectedSize)
                          ? "bg-zinc-800 text-zinc-500 cursor-not-allowed"
                          : "bg-[#25D366] hover:bg-[#128C7E] text-white"
                      }`}
                    >
                      {hasAnyStock ? 'Buy via WhatsApp' : 'Out of Stock'}
                    </a>

                    <div className="border border-zinc-800 rounded-md p-4 flex flex-col items-center bg-black/50">
                      <p className="text-[10px] text-zinc-400 uppercase tracking-widest font-bold mb-3 text-center">
                        Scan to Pay via UPI
                      </p>
                      <img loading="lazy" 
                        src="/qr-code.jpeg" 
                        alt="PhonePe UPI QR Code" 
                        className="w-48 h-48 object-contain bg-white p-2 rounded-md mb-2"
                        onError={(e) => {
                          // Fallback if image is not found
                          (e.target as HTMLImageElement).style.display = 'none';
                          const parent = (e.target as HTMLImageElement).parentElement;
                          if (parent) {
                            const p = document.createElement('p');
                            p.className = 'text-xs text-red-400 text-center py-8';
                            p.innerText = 'QR Code Image Not Found.\nPlease upload "qr-code.jpeg" to the public folder.';
                            parent.appendChild(p);
                          }
                        }}
                      />
                      <p className="text-[10px] text-zinc-500 text-center mt-2 max-w-[200px]">
                        After making payment, please share the screenshot on WhatsApp.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
          {/* Full Screen Image Viewer */}
          <AnimatePresence>
            {isFullScreenImage && product.images?.[0] && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-[60] bg-black/95 backdrop-blur-md flex items-center justify-center p-4 pointer-events-auto"
                onClick={() => setIsFullScreenImage(false)}
              >
                <button 
                  onClick={() => setIsFullScreenImage(false)}
                  className="absolute top-6 right-6 z-50 p-3 bg-white/10 hover:bg-white/20 text-white rounded-full transition-colors backdrop-blur-sm"
                >
                  <X size={24} />
                </button>
                <motion.img 
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0.9, opacity: 0 }}
                  src={product.images[currentImageIndex]} 
                  alt={product.name} 
                  className="max-w-full max-h-full object-contain rounded-md"
                  onClick={(e) => e.stopPropagation()}
                />
              </motion.div>
            )}
          </AnimatePresence>
        </>
      )}
    </AnimatePresence>
  );
}
