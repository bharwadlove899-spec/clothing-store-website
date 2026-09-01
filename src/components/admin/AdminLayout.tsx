import { useState } from "react";
import { Link, Outlet, useLocation, useNavigate } from "react-router-dom";
import { LayoutDashboard, ShoppingBag, Package, IndianRupee, BarChart3, Settings, LogOut, Menu, X, Globe, Home } from "lucide-react";
import { useAdmin } from "../../contexts/AdminContext";

const NAV_ITEMS = [
  { name: "Dashboard", path: "/admin/dashboard", icon: LayoutDashboard },
  { name: "Products", path: "/admin/products", icon: ShoppingBag },
  { name: "Inventory", path: "/admin/inventory", icon: Package },
  { name: "Daily Collection", path: "/admin/collections", icon: IndianRupee },
  { name: "Analytics", path: "/admin/analytics", icon: BarChart3 },
  { name: "Settings", path: "/admin/settings", icon: Settings },
];

export default function AdminLayout() {
  const { logout } = useAdmin();
  const location = useLocation();
  const navigate = useNavigate();
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  const handleLogout = async () => {
    await logout();
    navigate("/admin/login");
  };

  const SidebarContent = () => (
    <div className="flex flex-col h-full bg-zinc-950 border-r border-zinc-800 text-white w-64">
      <div className="p-6 border-b border-zinc-800">
        <h2 className="text-xl font-serif tracking-widest font-bold">RAYKA ADMIN</h2>
      </div>
      <nav className="flex-1 overflow-y-auto py-4">
        <ul className="space-y-1 px-3">
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname.startsWith(item.path);
            return (
              <li key={item.name}>
                <Link
                  to={item.path}
                  onClick={() => setIsMobileOpen(false)}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded transition-colors text-sm ${
                    isActive 
                      ? "bg-zinc-800 text-white font-medium" 
                      : "text-zinc-400 hover:text-white hover:bg-zinc-900"
                  }`}
                >
                  <Icon size={18} />
                  {item.name}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      <div className="p-4 border-t border-zinc-800 space-y-1">
        <Link
          to="/"
          className="flex w-full items-center gap-3 px-3 py-2.5 text-zinc-400 hover:text-white hover:bg-zinc-900 rounded transition-colors text-sm"
        >
          <Home size={18} />
          Go to Website (Home)
        </Link>
        <button
          onClick={handleLogout}
          className="flex w-full items-center gap-3 px-3 py-2.5 text-zinc-400 hover:text-red-400 hover:bg-zinc-900 rounded transition-colors text-sm"
        >
          <LogOut size={18} />
          Logout
        </button>
      </div>
    </div>
  );

  return (
    <div className="flex h-screen bg-black text-white overflow-hidden">
      {/* Desktop Sidebar */}
      <div className="hidden md:block shrink-0">
        <SidebarContent />
      </div>

      {/* Mobile Sidebar */}
      {isMobileOpen && (
        <div className="fixed inset-0 z-50 md:hidden flex">
          <div className="fixed inset-0 bg-black/80" onClick={() => setIsMobileOpen(false)} />
          <div className="relative z-50 h-full">
            <SidebarContent />
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="md:hidden h-16 border-b border-zinc-800 flex items-center px-4 bg-zinc-950 shrink-0">
          <button onClick={() => setIsMobileOpen(true)} className="p-2 -ml-2 text-zinc-400 hover:text-white">
            <Menu size={24} />
          </button>
          <h1 className="ml-2 font-serif tracking-widest text-lg font-bold">RAYKA ADMIN</h1>
        </header>
        
        <main className="flex-1 overflow-y-auto bg-zinc-950 p-4 md:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
