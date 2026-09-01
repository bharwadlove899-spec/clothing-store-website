import { motion } from "motion/react";
import { MapPin, Phone, Clock, ExternalLink, MessageCircle } from "lucide-react";

const STORES = [
  {
    id: 1,
    name: "Rayka Kapda House (Vastral)",
    address: "Near Rita Nagar Bus Station, Rabari Colony Road, Ahmedabad",
    mapLink: "https://maps.app.goo.gl/mbstfWrDaWxsbutj8?g_st=aw",
    phone: "+91 9723770286",
    whatsapp: "9723770286",
    hours: "10:00 AM - 11:00 PM",
    image: "/storefront.jpeg",
    status: "open"
  }
];

export default function Stores() {
  return (
    <div className="w-full bg-black-rich min-h-screen pt-12 pb-24">
      <div className="max-w-7xl mx-auto px-6">
        
        {/* Header */}
        <div className="text-center mb-16">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-5xl font-serif mb-4 tracking-tighter font-light"
          >
            Our <span className="italic text-primary">Stores</span>
          </motion.h1>
          <div className="w-16 h-0.5 bg-primary mx-auto mb-6" />
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-zinc-400 max-w-2xl mx-auto text-sm leading-relaxed font-light"
          >
            Visit us to experience the finest collections in person. Our style experts are ready to assist you.
          </motion.p>
        </div>

        {/* Store List */}
        <div className="space-y-12 md:space-y-24">
          {STORES.map((store, i) => (
            <motion.div 
              key={store.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.7 }}
              className={`flex flex-col ${i % 2 === 1 ? 'md:flex-row-reverse' : 'md:flex-row'} gap-8 md:gap-16 items-center`}
            >
              <div className="w-full md:w-1/2 relative h-[300px] md:h-[500px] overflow-hidden group">
                <img loading="lazy" 
                  src={store.image} 
                  alt={store.name} 
                  className={`absolute inset-0 w-full h-full object-cover transition-transform duration-1000 ${store.status === 'coming_soon' ? 'opacity-40 grayscale' : 'opacity-80 group-hover:scale-105'}`}
                />
                {store.status === 'coming_soon' && (
                  <div className="absolute inset-0 flex items-center justify-center bg-black/60">
                    <span className="text-white text-2xl font-serif tracking-widest uppercase">Coming Soon</span>
                  </div>
                )}
              </div>
              
              <div className="w-full md:w-1/2 space-y-6">
                <div>
                  {store.status === 'coming_soon' ? (
                     <span className="text-primary text-[10px] font-bold tracking-[0.3em] uppercase mb-2 block">Announcement</span>
                  ) : (
                     <span className="text-zinc-500 text-[10px] font-bold tracking-[0.3em] uppercase mb-2 block">Retail Experience</span>
                  )}
                  <h2 className="text-3xl font-serif text-white">{store.name}</h2>
                </div>
                
                <div className="space-y-4 text-zinc-400 text-sm font-light">
                  <div className="flex items-start gap-3 border-l-2 border-primary pl-4">
                    <div>
                      <p className="leading-relaxed">{store.address}</p>
                      {store.mapLink !== '#' && (
                        <a href={store.mapLink} target="_blank" rel="noreferrer" className="text-[10px] text-primary font-bold uppercase tracking-widest hover:text-white transition-colors flex items-center gap-1 mt-2">
                          Get Directions <ExternalLink size={12} />
                        </a>
                      )}
                    </div>
                  </div>
                  
                  {store.status !== 'coming_soon' && (
                    <>
                      <div className="flex items-center gap-3 border-l-2 border-zinc-800 pl-4">
                        <p className="font-mono">{store.phone}</p>
                      </div>
                      
                      <div className="flex items-center gap-3 border-l-2 border-zinc-800 pl-4">
                        <p className="uppercase text-[10px] tracking-widest">{store.hours}</p>
                      </div>
                    </>
                  )}
                </div>

                {store.status !== 'coming_soon' && (
                  <div className="pt-6 flex flex-wrap gap-4 border-t border-zinc-800">
                    <a 
                      href={`tel:${store.phone.replace(/[^0-9+]/g, '')}`} 
                      className="bg-primary text-white px-6 py-3 text-[10px] font-bold tracking-widest uppercase hover:bg-primary-dark transition-colors flex items-center gap-2"
                    >
                      Call Store
                    </a>
                    <a 
                      href={`https://wa.me/91${store.whatsapp}`} 
                      target="_blank"
                      rel="noreferrer"
                      className="bg-transparent border border-zinc-700 text-white px-6 py-3 text-[10px] font-bold tracking-widest uppercase hover:border-white transition-colors flex items-center gap-2"
                    >
                      <MessageCircle size={14} /> WhatsApp
                    </a>
                  </div>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
