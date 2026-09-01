import re

with open('src/App.tsx', 'r') as f:
    content = f.read()

# Replace static imports with dynamic imports
imports_to_replace = [
    ('import Home from "./pages/Home";', 'const Home = lazy(() => import("./pages/Home"));'),
    ('import Collections from "./pages/Collections";', 'const Collections = lazy(() => import("./pages/Collections"));'),
    ('import NewArrivals from "./pages/NewArrivals";', 'const NewArrivals = lazy(() => import("./pages/NewArrivals"));'),
    ('import About from "./pages/About";', 'const About = lazy(() => import("./pages/About"));'),
    ('import Stores from "./pages/Stores";', 'const Stores = lazy(() => import("./pages/Stores"));'),
    ('import Contact from "./pages/Contact";', 'const Contact = lazy(() => import("./pages/Contact"));'),
    ('import AdminLayout from "./components/admin/AdminLayout";', 'const AdminLayout = lazy(() => import("./components/admin/AdminLayout"));'),
    ('import AdminRoute from "./components/admin/AdminRoute";', 'const AdminRoute = lazy(() => import("./components/admin/AdminRoute"));'),
    ('import Login from "./pages/admin/Login";', 'const Login = lazy(() => import("./pages/admin/Login"));'),
    ('import Dashboard from "./pages/admin/Dashboard";', 'const Dashboard = lazy(() => import("./pages/admin/Dashboard"));'),
    ('import Products from "./pages/admin/Products";', 'const Products = lazy(() => import("./pages/admin/Products"));'),
    ('import AddProduct from "./pages/admin/AddProduct";', 'const AddProduct = lazy(() => import("./pages/admin/AddProduct"));'),
    ('import Inventory from "./pages/admin/Inventory";', 'const Inventory = lazy(() => import("./pages/admin/Inventory"));'),
    ('import AdminCollections from "./pages/admin/Collections";', 'const AdminCollections = lazy(() => import("./pages/admin/Collections"));'),
    ('import Analytics from "./pages/admin/Analytics";', 'const Analytics = lazy(() => import("./pages/admin/Analytics"));'),
    ('import Settings from "./pages/admin/Settings";', 'const Settings = lazy(() => import("./pages/admin/Settings"));'),
    ('import SetupAdmin from "./pages/admin/Setup";', 'const SetupAdmin = lazy(() => import("./pages/admin/Setup"));')
]

for old, new in imports_to_replace:
    content = content.replace(old, new)

# Add lazy and Suspense imports
content = content.replace('import { BrowserRouter, Routes, Route } from "react-router-dom";', 'import { lazy, Suspense } from "react";\nimport { BrowserRouter, Routes, Route } from "react-router-dom";')

# Add suspense fallback around routes
content = content.replace('<Routes>', '<Suspense fallback={<div className="flex h-screen items-center justify-center bg-black-rich text-white"><div className="w-8 h-8 border-4 border-zinc-800 border-t-primary rounded-full animate-spin"></div></div>}>\n        <Routes>')
content = content.replace('</Routes>', '</Routes>\n        </Suspense>')


with open('src/App.tsx', 'w') as f:
    f.write(content)

