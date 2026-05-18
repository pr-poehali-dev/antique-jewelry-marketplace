import { useState, useEffect } from "react";
import Icon from "@/components/ui/icon";
import type { CartItem } from "@/pages/Index";

const API_URL = "https://functions.poehali.dev/a7d65e38-ef61-4f2a-93fc-0ae9439533a8";

type Product = Omit<CartItem, "quantity"> & {
  category: string;
  era: string;
  description: string;
};

type CatalogProps = {
  addToCart: (item: Omit<CartItem, "quantity">) => void;
};

const CatalogSection = ({ addToCart }: CatalogProps) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState("Все");
  const [addedId, setAddedId] = useState<number | null>(null);

  useEffect(() => {
    fetch(API_URL)
      .then((r) => r.json())
      .then((data) => { setProducts(data); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  const categories = ["Все", ...Array.from(new Set(products.map((p) => p.category).filter(Boolean)))];

  const filtered =
    activeCategory === "Все"
      ? products
      : products.filter((p) => p.category === activeCategory);

  const handleAdd = (product: Product) => {
    addToCart({ id: product.id, name: product.name, price: product.price, image: product.image });
    setAddedId(product.id);
    setTimeout(() => setAddedId(null), 1500);
  };

  const formatPrice = (price: number) => price.toLocaleString("ru-RU") + " ₽";

  return (
    <section className="pt-32 pb-20 min-h-screen">
      <div className="max-w-7xl mx-auto px-6">
        {/* Title */}
        <div className="text-center mb-16">
          <p className="font-montserrat text-[10px] tracking-[0.6em] uppercase text-gold mb-4">
            — Наша коллекция —
          </p>
          <h2 className="font-cormorant text-5xl md:text-6xl font-light text-foreground">
            Каталог
          </h2>
          <div className="section-divider mt-6 max-w-xs mx-auto" />
        </div>

        {/* Filters */}
        {!loading && products.length > 0 && (
          <div className="flex flex-wrap gap-3 justify-center mb-12">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`font-montserrat text-[10px] tracking-[0.25em] uppercase px-5 py-2 border transition-all duration-300 ${
                  activeCategory === cat
                    ? "border-gold bg-gold/10 text-gold"
                    : "border-border text-muted-foreground hover:border-gold/50 hover:text-gold/70"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        )}

        {/* Loading */}
        {loading && (
          <div className="flex justify-center py-20">
            <Icon name="Loader2" size={32} className="animate-spin text-gold" />
          </div>
        )}

        {/* Grid */}
        {!loading && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map((product) => (
              <div key={product.id} className="luxury-card group cursor-pointer">
                {/* Image */}
                <div className="relative overflow-hidden aspect-[4/3]">
                  <img
                    src={product.image || "/placeholder.svg"}
                    alt={product.name}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-dark-base/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  {product.era && (
                    <div className="absolute top-4 left-4">
                      <span className="font-montserrat text-[9px] tracking-[0.3em] uppercase bg-gold/90 text-dark-base px-2 py-1">
                        {product.era}
                      </span>
                    </div>
                  )}
                </div>

                {/* Info */}
                <div className="p-6">
                  <p className="font-montserrat text-[9px] tracking-[0.3em] uppercase text-gold/60 mb-2">
                    {product.category}
                  </p>
                  <h3 className="font-cormorant text-xl font-light text-foreground mb-2 leading-tight">
                    {product.name}
                  </h3>
                  <p className="font-montserrat text-xs text-muted-foreground leading-relaxed mb-4">
                    {product.description}
                  </p>

                  <div className="flex items-center justify-between">
                    <span className="font-cormorant text-2xl text-gold font-light">
                      {formatPrice(product.price)}
                    </span>
                    <button
                      onClick={() => handleAdd(product)}
                      className={`flex items-center gap-2 font-montserrat text-[10px] tracking-[0.2em] uppercase px-4 py-2 transition-all duration-300 ${
                        addedId === product.id
                          ? "bg-gold text-dark-base"
                          : "border border-gold/40 text-gold hover:bg-gold hover:text-dark-base"
                      }`}
                    >
                      <Icon name={addedId === product.id ? "Check" : "ShoppingBag"} size={12} />
                      {addedId === product.id ? "Добавлено" : "В корзину"}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {!loading && filtered.length === 0 && (
          <div className="text-center py-20">
            <p className="font-cormorant text-2xl text-muted-foreground font-light">Товары не найдены</p>
          </div>
        )}
      </div>
    </section>
  );
};

export default CatalogSection;
