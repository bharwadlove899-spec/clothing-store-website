import { motion } from "motion/react";
import { MapPin, Phone, Instagram, Send, MessageCircle } from "lucide-react";
import React, { useState } from "react";

export default function Contact() {
  const [formData, setFormData] = useState({ name: "", phone: "", message: "" });
  const [status, setStatus] = useState<"idle" | "error" | "success">("idle");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.phone.trim() || !formData.message.trim()) {
      setStatus("error");
      return;
    }
    
    // Simulate sending
    setStatus("success");
    setTimeout(() => {
      setStatus("idle");
      setFormData({ name: "", phone: "", message: "" });
    }, 3000);
  };

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
            Get <span className="italic text-primary">In Touch</span>
          </motion.h1>
          <div className="w-16 h-0.5 bg-primary mx-auto mb-6" />
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-zinc-400 max-w-2xl mx-auto text-sm font-light leading-relaxed"
          >
            We would love to hear from you. Visit our stores or drop us a message.
          </motion.p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24">
          
          {/* Contact Information */}
          <motion.div 
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="space-y-12"
          >
            <div>
              <h2 className="text-2xl font-serif mb-6 text-offwhite">Contact Details</h2>
              <div className="space-y-6 text-neutral-300">
                
                <div className="flex items-start gap-4 border-l-2 border-primary pl-4">
                  <div>
                    <h4 className="text-white text-[10px] font-bold mb-1 uppercase tracking-widest">Main Branch</h4>
                    <p className="leading-relaxed text-zinc-400 mb-2 text-sm font-light">
                      Near Rita Nagar bus station, Rabari Colony road, Ahmedabad, Gujarat
                    </p>
                    <a href="https://maps.app.goo.gl/mbstfWrDaWxsbutj8?g_st=aw" target="_blank" rel="noreferrer" className="text-primary text-[10px] uppercase font-bold tracking-widest hover:text-white transition-colors underline underline-offset-4">
                      View on Google Maps
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-4 border-l-2 border-zinc-800 pl-4">
                  <div>
                    <h4 className="text-white text-[10px] font-bold mb-1 uppercase tracking-widest">Phone Support</h4>
                    <p className="text-primary font-mono mb-2">+91 97237 70286</p>
                    <div className="flex gap-4">
                      <a href="tel:9723770286" className="text-[10px] font-bold tracking-widest uppercase border border-zinc-700 px-3 py-1 hover:text-white hover:border-white transition-colors">Call Now</a>
                      <a href="https://wa.me/919723770286" target="_blank" rel="noreferrer" className="flex items-center gap-1 text-[10px] font-bold tracking-widest uppercase border border-zinc-700 px-3 py-1 hover:text-white hover:border-white transition-colors">
                        <MessageCircle size={12} /> WhatsApp
                      </a>
                    </div>
                  </div>
                </div>

                <div className="flex items-start gap-4 border-l-2 border-zinc-800 pl-4">
                  <div>
                    <h4 className="text-white text-[10px] font-bold mb-1 uppercase tracking-widest">Social Media</h4>
                    <p className="text-zinc-400 mb-2 text-sm font-light">Join our 150K+ community</p>
                    <a href="https://www.instagram.com/rayka_kapda_house?igsi=ejZteTcxcTkyMnZn" target="_blank" rel="noreferrer" className="text-[10px] font-bold uppercase tracking-widest text-primary hover:text-white transition-colors">
                      @rayka_kapda_house
                    </a>
                  </div>
                </div>
                
              </div>
            </div>
            
            <div className="bg-black-light border border-zinc-800 p-8">
              <h3 className="font-serif text-xl mb-2">Business Hours</h3>
              <p className="text-zinc-400 text-sm font-light">Open Daily: 10:00 AM – 11:00 PM</p>
            </div>
          </motion.div>

          {/* Contact Form */}
          <motion.div 
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-black-light p-8 border border-zinc-800"
          >
            <h2 className="text-2xl font-serif mb-6 text-white">Send a Message</h2>
            <form onSubmit={handleSubmit} className="space-y-6">
              
              {status === "error" && (
                <div className="bg-primary-dark/20 border border-primary text-white px-4 py-3 text-sm">
                  Please fill in all required fields.
                </div>
              )}
              {status === "success" && (
                <div className="bg-green-900/20 border border-green-500 text-green-400 px-4 py-3 text-sm">
                  Thank you! Your message has been sent successfully.
                </div>
              )}

              <div>
                <label htmlFor="name" className="block text-[10px] font-bold uppercase tracking-widest text-zinc-500 mb-2">Full Name *</label>
                <input 
                  type="text" 
                  id="name"
                  value={formData.name}
                  onChange={e => setFormData({...formData, name: e.target.value})}
                  className="w-full bg-black-rich border border-zinc-800 focus:border-primary px-4 py-3 text-white outline-none transition-colors text-sm"
                  placeholder="Enter your name"
                />
              </div>

              <div>
                <label htmlFor="phone" className="block text-[10px] font-bold uppercase tracking-widest text-zinc-500 mb-2">Phone Number *</label>
                <input 
                  type="tel" 
                  id="phone"
                  value={formData.phone}
                  onChange={e => setFormData({...formData, phone: e.target.value})}
                  className="w-full bg-black-rich border border-zinc-800 focus:border-primary px-4 py-3 text-white outline-none transition-colors text-sm"
                  placeholder="Enter your phone number"
                />
              </div>

              <div>
                <label htmlFor="message" className="block text-[10px] font-bold uppercase tracking-widest text-zinc-500 mb-2">Message *</label>
                <textarea 
                  id="message"
                  rows={5}
                  value={formData.message}
                  onChange={e => setFormData({...formData, message: e.target.value})}
                  className="w-full bg-black-rich border border-zinc-800 focus:border-primary px-4 py-3 text-white outline-none transition-colors resize-none text-sm"
                  placeholder="How can we help you?"
                ></textarea>
              </div>

              <button 
                type="submit" 
                className="bg-primary text-white w-full py-4 text-[10px] font-bold tracking-widest uppercase hover:bg-primary-dark transition-colors flex items-center justify-center gap-2"
              >
                <Send size={14} /> Send Message
              </button>
            </form>
          </motion.div>

        </div>
      </div>
    </div>
  );
}
