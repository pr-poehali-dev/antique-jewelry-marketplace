import { useState } from "react";
import Icon from "@/components/ui/icon";
import type { CartItem } from "@/pages/Index";

const ITEMS_IMG_1 =
  "https://cdn.poehali.dev/projects/6c64a30b-64f4-450f-b32f-5933dbf60ce9/files/cfabb9e8-17f8-4db7-9008-1b896d354048.jpg";
const ITEMS_IMG_2 =
  "https://cdn.poehali.dev/projects/6c64a30b-64f4-450f-b32f-5933dbf60ce9/files/676886b2-51db-4188-8266-a97d9dc42ca5.jpg";
const HERO_IMG =
  "https://cdn.poehali.dev/projects/6c64a30b-64f4-450f-b32f-5933dbf60ce9/files/919a48c1-c3c9-42b4-b833-5a231235bf9c.jpg";

type Product = Omit<CartItem, "quantity"> & {
  category: string;
  era: string;
  description: string;
};

const products: Product[] = [
  {
    id: 1,
    name: "Карманные часы «Брегет»",
    price: 185000,
    image: ITEMS_IMG_1,
    category: "Часы",
    era: "XIX век",
    description: "Золотые карманные часы с репетиром. Швейцария, около 1870 года.",
  },
  {
    id: 2,
    name: "Серебряный чайный сервиз",
    price: 320000,
    image: ITEMS_IMG_2,
    category: "Серебро",
    era: "XIX век",
    description: "Полный чайный сервиз на 6 персон. Петербург, мастер Хлебников, 1885 г.",
  },
  {
    id: 3,
    name: "Ювелирная шкатулка арт-деко",
    price: 95000,
    image: ITEMS_IMG_1,
    category: "Украшения",
    era: "1920-е",
    description: "Латунь, бронза, позолота. Франция, эпоха ар-деко.",
  },
  {
    id: 4,
    name: "Бронзовая скульптура",
    price: 240000,
    image: HERO_IMG,
    category: "Скульптура",
    era: "XVIII век",
    description: "«Охотник с собакой». Литая бронза, мраморный постамент.",
  },
  {
    id: 5,
    name: "Фарфоровая ваза Мейсен",
    price: 175000,
    image: ITEMS_IMG_2,
    category: "Фарфор",
    era: "XVIII век",
    description: "Расписная ваза с пасторальными сценами. Meissen, около 1760 г.",
  },
  {
    id: 6,
    name: "Масляный портрет дамы",
    price: 420000,
    image: ITEMS_IMG_1,
    category: "Живопись",
    era: "XIX век",
    description: "Холст, масло, в оригинальной золоченой раме. Россия, 1860-е г.",
  },
];

const categories = ["Все", "Часы", "Серебро", "Украшения", "Скульптура", "Фарфор", "Живопись"];

type CatalogProps = {
  addToCart: (item: Omit<CartItem, "quantity">) => void;
};

const CatalogSection = ({ addToCart }: CatalogProps) => {
  const [activeCategory, setActiveCategory] = useState("Все");
  const [addedId, setAddedId] = useState<number | null>(null);

  const filtered =
    activeCategory === "Все"
      ? products
      : products.filter((p) => p.category === activeCategory);

  const handleAdd = (product: Product) => {
    addToCart({ id: product.id, name: product.name, price: product.price, image: product.image });
    setAddedId(product.id);
    setTimeout(() => setAddedId(null), 1500);
  };

  const formatPrice = (price: number) =>
    price.toLocaleString("ru-RU") + " ₽";

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

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((product) => (
            <div key={product.id} className="luxury-card group cursor-pointer">
              {/* Image */}
              <div className="relative overflow-hidden aspect-[4/3]">
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-dark-base/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <div className="absolute top-4 left-4">
                  <span className="font-montserrat text-[9px] tracking-[0.3em] uppercase bg-gold/90 text-dark-base px-2 py-1">
                    {product.era}
                  </span>
                </div>
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
      </div>
    </section>
  );
};

export default CatalogSection;
