import { motion } from "motion/react";

export default function About() {
  return (
    <div className="w-full bg-black-rich min-h-screen">
      {/* Hero */}
      <div className="relative h-[60vh] w-full overflow-hidden">
        <img loading="lazy" 
          src="https://images.unsplash.com/photo-1558769132-cb1fac08404a?q=80&w=2000&auto=format&fit=crop" 
          alt="About Rayka Kapda House" 
          className="absolute inset-0 w-full h-full object-cover opacity-50"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black-rich to-transparent" />
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-6">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-6xl font-serif text-white tracking-tighter font-light mb-4"
          >
            Our <span className="italic text-primary">Story</span>
          </motion.h1>
          <motion.div 
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
            className="w-16 h-0.5 bg-primary mx-auto" 
          />
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-6 py-24 space-y-20">
        <motion.section 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center"
        >
          <h2 className="text-2xl md:text-3xl font-serif mb-6 text-white">A Legacy of Trust and Style</h2>
          <p className="text-zinc-400 text-sm font-light leading-relaxed mb-6">
            Rayka Kapda House began with a simple vision: to bring premium, high-quality fashion to the heart of Ahmedabad. Over the years, we have grown from a single storefront into a multi-branch destination for those who appreciate fine clothing.
          </p>
          <p className="text-zinc-400 text-sm font-light leading-relaxed">
            Our commitment to quality fabrics, contemporary designs, and timeless traditional wear has helped us build a strong, loyal community. Today, we are proud to serve over 150,000 fashion lovers across our social platforms and welcome countless customers into our physical stores every day.
          </p>
        </motion.section>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <motion.img 
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            src="https://images.unsplash.com/photo-1593030103066-0093718efeb9?q=80&w=1000&auto=format&fit=crop" 
            alt="Store Interior"
            className="w-full h-[400px] object-cover grayscale hover:grayscale-0 transition-all duration-700"
          />
          <motion.img 
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            src="https://images.unsplash.com/photo-1583391265517-35bbd32c96c4?q=80&w=1000&auto=format&fit=crop" 
            alt="Premium Fabrics"
            className="w-full h-[400px] object-cover grayscale hover:grayscale-0 transition-all duration-700"
          />
        </div>

        <motion.section 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center"
        >
          <h2 className="text-2xl md:text-3xl font-serif mb-6 text-white">Growing With You</h2>
          <p className="text-zinc-400 text-sm font-light leading-relaxed mb-6">
            With two established branches and a third one on the way, our expansion is a direct reflection of your support. We continually strive to curate collections that blend modern trends with classic elegance. 
          </p>
          <p className="text-zinc-400 text-sm font-light leading-relaxed">
            Whether you are looking for the perfect casual wear, sharp men's apparel, or exquisite traditional outfits, our team is dedicated to helping you discover style that defines you.
          </p>
        </motion.section>

        <motion.section 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="bg-black-light border border-zinc-800 p-8 md:p-12 text-center"
        >
          <h3 className="font-serif text-xl mb-4 text-white">[Placeholder for Founder's Note / Brand Values]</h3>
          <p className="text-zinc-500 italic text-sm font-light">
            "Replace this text with a personal message from the founders or specific brand values you wish to highlight. For example, emphasizing customer service, specific fabric sourcing, or the history of the establishment."
          </p>
        </motion.section>
      </div>
    </div>
  );
}
