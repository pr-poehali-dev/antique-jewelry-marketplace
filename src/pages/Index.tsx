import { useState } from "react";
import Header from "@/components/Header";
import HeroSection from "@/components/HeroSection";
import CatalogSection from "@/components/CatalogSection";
import AboutSection from "@/components/AboutSection";
import DeliverySection from "@/components/DeliverySection";
import ContactsSection from "@/components/ContactsSection";
import Footer from "@/components/Footer";
import CartDrawer from "@/components/CartDrawer";
import CheckoutModal from "@/components/CheckoutModal";

export type CartItem = {
  id: number;
  name: string;
  price: number;
  image: string;
  quantity: number;
};

const Index = () => {
  const [activePage, setActivePage] = useState<string>("home");
  const [cartOpen, setCartOpen] = useState(false);
  const [checkoutOpen, setCheckoutOpen] = useState(false);
  const [cartItems, setCartItems] = useState<CartItem[]>([]);

  const addToCart = (item: Omit<CartItem, "quantity">) => {
    setCartItems((prev) => {
      const existing = prev.find((i) => i.id === item.id);
      if (existing) {
        return prev.map((i) =>
          i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i
        );
      }
      return [...prev, { ...item, quantity: 1 }];
    });
    setCartOpen(true);
  };

  const removeFromCart = (id: number) => {
    setCartItems((prev) => prev.filter((i) => i.id !== id));
  };

  const updateQuantity = (id: number, qty: number) => {
    if (qty < 1) return removeFromCart(id);
    setCartItems((prev) =>
      prev.map((i) => (i.id === id ? { ...i, quantity: qty } : i))
    );
  };

  const totalCount = cartItems.reduce((sum, i) => sum + i.quantity, 0);

  return (
    <div className="min-h-screen bg-background">
      <Header
        activePage={activePage}
        setActivePage={setActivePage}
        cartCount={totalCount}
        onCartOpen={() => setCartOpen(true)}
      />

      <main>
        {activePage === "home" && (
          <>
            <HeroSection setActivePage={setActivePage} />
            <AboutSection setActivePage={setActivePage} fullPage={false} />
          </>
        )}
        {activePage === "catalog" && (
          <CatalogSection addToCart={addToCart} />
        )}
        {activePage === "about" && (
          <AboutSection setActivePage={setActivePage} fullPage />
        )}
        {activePage === "delivery" && <DeliverySection />}
        {activePage === "contacts" && <ContactsSection />}
      </main>

      <Footer setActivePage={setActivePage} />

      <CartDrawer
        open={cartOpen}
        onClose={() => setCartOpen(false)}
        items={cartItems}
        onRemove={removeFromCart}
        onUpdateQty={updateQuantity}
        onCheckout={() => {
          setCartOpen(false);
          setCheckoutOpen(true);
        }}
      />

      <CheckoutModal
        open={checkoutOpen}
        onClose={() => setCheckoutOpen(false)}
        items={cartItems}
        onSuccess={() => {
          setCartItems([]);
          setCheckoutOpen(false);
        }}
      />
    </div>
  );
};

export default Index;
