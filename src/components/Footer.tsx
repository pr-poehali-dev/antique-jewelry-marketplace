type FooterProps = {
  setActivePage: (page: string) => void;
};

const Footer = ({ setActivePage }: FooterProps) => {
  const navLinks = [
    { id: "home", label: "Главная" },
    { id: "catalog", label: "Каталог" },
    { id: "about", label: "О нас" },
    { id: "delivery", label: "Доставка и оплата" },
    { id: "contacts", label: "Контакты" },
  ];

  return (
    <footer className="bg-dark-surface border-t border-border">
      <div className="max-w-7xl mx-auto px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-12">
          {/* Brand */}
          <div>
            <div className="font-cormorant text-2xl font-light tracking-[0.3em] text-gold uppercase leading-none mb-1">
              Антикварный
            </div>
            <div className="font-montserrat text-[10px] tracking-[0.5em] text-gold-muted uppercase leading-none mb-5">
              Дом · Est. 1987
            </div>
            <p className="font-montserrat text-xs text-muted-foreground leading-relaxed max-w-xs">
              Избранная коллекция антиквариата, ювелирных украшений и предметов
              искусства для ценителей прекрасного.
            </p>
          </div>

          {/* Navigation */}
          <div>
            <p className="font-montserrat text-[9px] tracking-[0.4em] uppercase text-gold/60 mb-5">
              Разделы
            </p>
            <nav className="flex flex-col gap-3">
              {navLinks.map((link) => (
                <button
                  key={link.id}
                  onClick={() => setActivePage(link.id)}
                  className="font-montserrat text-xs text-muted-foreground hover:text-gold transition-colors duration-300 text-left"
                >
                  {link.label}
                </button>
              ))}
            </nav>
          </div>

          {/* Contact */}
          <div>
            <p className="font-montserrat text-[9px] tracking-[0.4em] uppercase text-gold/60 mb-5">
              Контакты
            </p>
            <div className="space-y-3 font-montserrat text-xs text-muted-foreground">
              <p>Москва, ул. Арбат, 24</p>
              <p>+7 (495) 123-45-67</p>
              <p>info@antique-house.ru</p>
              <p className="pt-2 text-gold/50">Ежедневно 11:00–20:00</p>
            </div>
          </div>
        </div>

        <div className="section-divider mb-8" />

        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="font-montserrat text-[10px] text-muted-foreground">
            © 2026 Антикварный Дом. Все права защищены.
          </p>
          <p className="font-montserrat text-[10px] text-muted-foreground">
            Все предметы имеют сертификат подлинности
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
