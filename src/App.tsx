/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { lazy, Suspense } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AdminProvider } from "./contexts/AdminContext";

import Layout from "./components/Layout";
const Home = lazy(() => import("./pages/Home"));
const Collections = lazy(() => import("./pages/Collections"));
const NewArrivals = lazy(() => import("./pages/NewArrivals"));
const About = lazy(() => import("./pages/About"));
const Stores = lazy(() => import("./pages/Stores"));
const Contact = lazy(() => import("./pages/Contact"));

// Admin
const AdminLayout = lazy(() => import("./components/admin/AdminLayout"));
const AdminRoute = lazy(() => import("./components/admin/AdminRoute"));
const Login = lazy(() => import("./pages/admin/Login"));
const Dashboard = lazy(() => import("./pages/admin/Dashboard"));
const Products = lazy(() => import("./pages/admin/Products"));
const AddProduct = lazy(() => import("./pages/admin/AddProduct"));
const Inventory = lazy(() => import("./pages/admin/Inventory"));
const AdminCollections = lazy(() => import("./pages/admin/Collections"));
const Analytics = lazy(() => import("./pages/admin/Analytics"));
const Settings = lazy(() => import("./pages/admin/Settings"));
const SetupAdmin = lazy(() => import("./pages/admin/Setup"));

export default function App() {
  return (
    <AdminProvider>
      <BrowserRouter>
        <Suspense fallback={<div className="flex h-screen items-center justify-center bg-black-rich text-white"><div className="w-8 h-8 border-4 border-zinc-800 border-t-primary rounded-full animate-spin"></div></div>}>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Layout />}>
            <Route index element={<Home />} />
            <Route path="collections" element={<Collections />} />
            <Route path="new-arrivals" element={<NewArrivals />} />
            <Route path="about" element={<About />} />
            <Route path="stores" element={<Stores />} />
            <Route path="contact" element={<Contact />} />
          </Route>

          {/* Admin Login */}
          <Route path="/admin/login" element={<Login />} />
          <Route path="/admin/setup" element={<SetupAdmin />} />

          {/* Admin Protected Routes */}
          <Route path="/admin" element={<AdminRoute />}>
            <Route element={<AdminLayout />}>
              <Route path="dashboard" element={<Dashboard />} />
              <Route path="products" element={<Products />} />
              <Route path="products/new" element={<AddProduct />} />
              <Route path="products/:id/edit" element={<AddProduct />} />
              <Route path="inventory" element={<Inventory />} />
              <Route path="collections" element={<AdminCollections />} />
              <Route path="analytics" element={<Analytics />} />
              <Route path="settings" element={<Settings />} />
            </Route>
          </Route>
        </Routes>
        </Suspense>
      </BrowserRouter>
    </AdminProvider>
  );
}
