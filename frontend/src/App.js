import { useEffect } from "react";
import "@/App.css";
import { BrowserRouter, Routes, Route, Link, useLocation } from "react-router-dom";
import Lenis from "lenis";
import { Toaster } from "sonner";
import { WishlistProvider } from "./context/WishlistContext";
import { AdminAuthProvider } from "./context/AdminAuthContext";
import { Header } from "./components/layout/Header";
import { Footer } from "./components/layout/Footer";
import Home from "./pages/Home";
import Shop from "./pages/Shop";
import ProductDetail from "./pages/ProductDetail";
import About from "./pages/About";
import Contact from "./pages/Contact";
import Wishlist from "./pages/Wishlist";
import { AdminLogin, AdminDashboard } from "./pages/Admin";

const ScrollManager = () => {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
};

function App() {
  useEffect(() => {
    const lenis = new Lenis({ lerp: 0.09, wheelMultiplier: 1 });
    const raf = (time) => {
      lenis.raf(time);
      requestAnimationFrame(raf);
    };
    requestAnimationFrame(raf);
    return () => lenis.destroy();
  }, []);

  return (
    <div className="App">
      <WishlistProvider>
        <AdminAuthProvider>
          <BrowserRouter>
            <ScrollManager />
            <Header />
            <main>
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/shop" element={<Shop />} />
                <Route path="/product/:slug" element={<ProductDetail />} />
                <Route path="/about" element={<About />} />
                <Route path="/contact" element={<Contact />} />
                <Route path="/wishlist" element={<Wishlist />} />
                <Route path="/admin" element={<AdminLogin />} />
                <Route path="/admin/dashboard" element={<AdminDashboard />} />
                <Route
                  path="*"
                  element={
                    <div className="flex min-h-[70vh] flex-col items-center justify-center gap-6 px-6 pt-[76px] text-center">
                      <p className="font-serif-display text-4xl font-light">This page does not exist.</p>
                      <Link to="/" className="btn-primary">Back home</Link>
                    </div>
                  }
                />
              </Routes>
            </main>
            <Footer />
          </BrowserRouter>
        </AdminAuthProvider>
        <Toaster position="bottom-center" toastOptions={{ style: { background: "#121212", color: "#F8F6F2", border: "none", borderRadius: 0, fontSize: "0.8rem", letterSpacing: "0.04em" } }} />
      </WishlistProvider>
    </div>
  );
}

export default App;
