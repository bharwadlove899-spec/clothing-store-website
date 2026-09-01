import { Link, Outlet, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import { Menu, X, Instagram, MapPin, Phone } from "lucide-react";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const navLinks = [
  { name: "Home", path: "/" },
  { name: "Collections", path: "/collections" },
  { name: "New Arrivals", path: "/new-arrivals" },
  { name: "About Us", path: "/about" },
  { name: "Our Stores", path: "/stores" },
  { name: "Contact", path: "/contact" },
];

export default function Layout() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    window.scrollTo(0, 0);
    setMobileMenuOpen(false);
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex flex-col">
      {/* Top Bar */}
      <div className="hidden md:flex justify-between items-center px-8 py-2 bg-black-rich text-xs text-neutral-400 border-b border-neutral-900">
        <div className="flex items-center gap-4">
          <span className="flex items-center gap-1"><MapPin size={12} /> Ahmedabad, Gujarat</span>
          <span className="flex items-center gap-1"><Phone size={12} /> +91 9723770286</span>
        </div>
        <div className="flex items-center gap-4">
          <a href="https://www.instagram.com/rayka_kapda_house?igsi=ejZteTcxcTkyMnZn" target="_blank" rel="noreferrer" className="hover:text-primary transition-colors flex items-center gap-1">
            <Instagram size={12} /> 150K+ Followers
          </a>
        </div>
      </div>

      {/* Main Navbar */}
      <nav
        className={cn(
          "sticky top-0 z-50 transition-all duration-300",
          isScrolled ? "bg-black-rich/95 backdrop-blur-md shadow-lg py-4 border-b border-neutral-900" : "bg-black-rich py-6"
        )}
      >
        <div className="max-w-7xl mx-auto px-6 md:px-8 flex justify-between items-center">
          {/* Mobile Menu Button */}
          <button 
            className="md:hidden text-offwhite hover:text-primary transition-colors"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>

          {/* Logo */}
          <Link to="/" className="flex flex-col items-center md:items-start justify-center md:justify-start group flex-1 -mt-[22px]">
            <img src="/rayka-logo.png" alt="Rayka Kapda House" className="h-14 md:h-16 w-auto object-contain mb-1" />
            <span className="text-[22px] leading-[21px] font-serif tracking-tighter text-white font-light">RAYKA <span className="text-primary font-normal group-hover:text-white transition-colors">KAPDA HOUSE</span></span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-8 text-[11px] uppercase tracking-[0.2em] font-medium">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={cn(
                  "transition-colors hover:text-primary pb-1 border-b border-transparent hover:border-primary",
                  location.pathname === link.path ? "text-primary border-primary" : "text-neutral-400"
                )}
              >
                {link.name}
              </Link>
            ))}
          </div>

          {/* Right Action (placeholder) */}
          <div className="hidden md:flex w-6 h-6" />
        </div>

        {/* Mobile Nav */}
        <div className={cn(
          "md:hidden absolute top-full left-0 w-full bg-black-rich border-b border-neutral-900 transition-all duration-300 overflow-hidden",
          mobileMenuOpen ? "max-h-[400px] py-4" : "max-h-0 py-0 border-transparent"
        )}>
          <div className="flex flex-col px-6 gap-4">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={cn(
                  "text-sm font-medium tracking-wide transition-colors hover:text-primary uppercase py-2",
                  location.pathname === link.path ? "text-primary" : "text-neutral-300"
                )}
              >
                {link.name}
              </Link>
            ))}
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="flex-1">
        <Outlet />
      </main>

      {/* Footer */}
      <footer className="bg-black border-t border-zinc-900 pt-16 pb-8 px-6 md:px-8">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-12 mb-12">
          <div className="col-span-1 md:col-span-1">
            <Link to="/" className="flex flex-col items-start group mb-6">
              <img src="/rayka-logo.png" alt="Rayka Kapda House" className="h-16 w-auto object-contain mb-2" />
              <span className="text-xl font-serif tracking-tighter text-white font-light">RAYKA <span className="text-primary font-normal group-hover:text-white transition-colors">KAPDA HOUSE</span></span>
            </Link>
            <p className="text-zinc-400 text-[11px] leading-relaxed mb-6 font-light">
              Style That Defines You. Premium Indian fashion retail based in Ahmedabad, Gujarat.
            </p>
            <div className="flex gap-4">
              <a href="https://www.instagram.com/rayka_kapda_house?igsi=ejZteTcxcTkyMnZn" target="_blank" rel="noreferrer" className="w-10 h-10 rounded-full border border-zinc-800 flex items-center justify-center hover:bg-white hover:text-black hover:border-white transition-all text-zinc-400">
                <Instagram size={14} />
              </a>
            </div>
          </div>
          
          <div>
            <h4 className="font-bold text-[10px] uppercase tracking-[0.3em] mb-6 text-zinc-500">Quick Links</h4>
            <ul className="space-y-3">
              {navLinks.slice(1, 5).map(link => (
                <li key={link.name}>
                  <Link to={link.path} className="text-zinc-400 hover:text-white transition-colors text-[11px] uppercase tracking-widest font-bold">
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-[10px] uppercase tracking-[0.3em] mb-6 text-zinc-500">Contact</h4>
            <ul className="space-y-3 text-sm text-zinc-400 font-light">
              <li className="flex items-start gap-3">
                <MapPin size={14} className="mt-1 shrink-0 text-primary" />
                <span className="text-[11px] leading-relaxed">Near Rita Nagar bus station, Rabari Colony road, Ahmedabad</span>
              </li>
              <li className="flex items-center gap-3">
                <Phone size={14} className="shrink-0 text-primary" />
                <span className="font-mono text-[11px]">+91 97237 70286</span>
              </li>
            </ul>
          </div>
        </div>
        
          <div className="max-w-7xl mx-auto border-t border-zinc-900 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-[9px] uppercase tracking-[0.2em] font-bold text-zinc-600">
          <p>&copy; {new Date().getFullYear()} Rayka Kapda House.</p>
          <div className="flex gap-4">
            <Link to="/admin/login" className="hover:text-zinc-400 cursor-pointer transition-colors">Admin Login</Link>
            <span className="hover:text-zinc-400 cursor-pointer transition-colors">Privacy Policy</span>
            <span className="hover:text-zinc-400 cursor-pointer transition-colors">Terms of Service</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
