import { useState } from "react";
import Icon from "@/components/ui/icon";

type HeaderProps = {
  activePage: string;
  setActivePage: (page: string) => void;
  cartCount: number;
  onCartOpen: () => void;
};

const navItems = [
  { id: "home", label: "Главная" },
  { id: "catalog", label: "Каталог" },
  { id: "about", label: "О нас" },
  { id: "delivery", label: "Доставка и оплата" },
  { id: "contacts", label: "Контакты" },
];

const Header = ({ activePage, setActivePage, cartCount, onCartOpen }: HeaderProps) => {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-dark-base/95 backdrop-blur-md border-b border-gold-dark/30">
      <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
        {/* Logo */}
        <button
          onClick={() => setActivePage("home")}
          className="flex flex-col items-start group"
        >
          <span className="font-cormorant text-2xl font-light tracking-[0.3em] text-gold leading-none uppercase">
            Антикварный
          </span>
          <span className="font-montserrat text-[10px] tracking-[0.5em] text-gold-muted uppercase leading-none mt-1">
            Дом · Est. 1987
          </span>
        </button>

        {/* Desktop Nav */}
        <nav className="hidden lg:flex items-center gap-8">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActivePage(item.id)}
              className={`font-montserrat text-xs tracking-[0.2em] uppercase transition-all duration-300 relative group ${
                activePage === item.id
                  ? "text-gold"
                  : "text-foreground/60 hover:text-gold"
              }`}
            >
              {item.label}
              <span
                className={`absolute -bottom-1 left-0 h-px bg-gold transition-all duration-300 ${
                  activePage === item.id ? "w-full" : "w-0 group-hover:w-full"
                }`}
              />
            </button>
          ))}
        </nav>

        {/* Right Actions */}
        <div className="flex items-center gap-4">
          <button
            onClick={onCartOpen}
            className="relative flex items-center gap-2 text-foreground/70 hover:text-gold transition-colors duration-300"
          >
            <Icon name="ShoppingBag" size={20} />
            {cartCount > 0 && (
              <span className="absolute -top-2 -right-2 w-4 h-4 rounded-full gold-gradient flex items-center justify-center text-[10px] font-montserrat font-medium text-dark-base">
                {cartCount}
              </span>
            )}
          </button>

          <button
            className="lg:hidden text-foreground/70 hover:text-gold transition-colors"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            <Icon name={menuOpen ? "X" : "Menu"} size={22} />
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="lg:hidden bg-dark-surface border-t border-gold-dark/30 animate-fade-in">
          <nav className="flex flex-col px-6 py-6 gap-5">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => {
                  setActivePage(item.id);
                  setMenuOpen(false);
                }}
                className={`font-montserrat text-xs tracking-[0.2em] uppercase text-left transition-colors ${
                  activePage === item.id ? "text-gold" : "text-foreground/60"
                }`}
              >
                {item.label}
              </button>
            ))}
          </nav>
        </div>
      )}
    </header>
  );
};

export default Header;
