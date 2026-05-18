import { useEffect, useState } from "react";
import Icon from "@/components/ui/icon";
import type { CartItem } from "@/pages/Index";

type Product = Omit<CartItem, "quantity"> & {
  category: string;
  era: string;
  description: string;
};

type Props = {
  product: Product | null;
  onClose: () => void;
  onAddToCart: (item: Omit<CartItem, "quantity">) => void;
};

const ProductModal = ({ product, onClose, onAddToCart }: Props) => {
  const [added, setAdded] = useState(false);

  useEffect(() => {
    if (!product) return;
    setAdded(false);
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [product, onClose]);

  if (!product) return null;

  const formatPrice = (price: number) => price.toLocaleString("ru-RU") + " ₽";

  const handleAdd = () => {
    onAddToCart({ id: product.id, name: product.name, price: product.price, image: product.image });
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-dark-base/90 backdrop-blur-md z-50"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div className="bg-dark-surface border border-border w-full max-w-3xl max-h-[90vh] overflow-y-auto animate-fade-in relative">

          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 z-10 w-9 h-9 border border-border bg-dark-surface flex items-center justify-center text-muted-foreground hover:text-gold hover:border-gold/50 transition-all duration-300"
          >
            <Icon name="X" size={16} />
          </button>

          <div className="grid grid-cols-1 md:grid-cols-2">
            {/* Image */}
            <div className="relative aspect-square md:aspect-auto md:min-h-[420px] overflow-hidden bg-dark-elevated">
              {product.image ? (
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <Icon name="Image" size={48} className="text-muted-foreground/20" />
                </div>
              )}
              {product.era && (
                <div className="absolute top-4 left-4">
                  <span className="font-montserrat text-[9px] tracking-[0.3em] uppercase bg-gold/90 text-dark-base px-2 py-1">
                    {product.era}
                  </span>
                </div>
              )}
            </div>

            {/* Info */}
            <div className="p-8 flex flex-col">
              {product.category && (
                <p className="font-montserrat text-[9px] tracking-[0.4em] uppercase text-gold/60 mb-3">
                  {product.category}
                </p>
              )}

              <h2 className="font-cormorant text-3xl md:text-4xl font-light text-foreground leading-tight mb-4">
                {product.name}
              </h2>

              <div className="section-divider mb-6 max-w-[60px]" />

              {product.description && (
                <p className="font-montserrat text-sm text-muted-foreground leading-relaxed mb-6 flex-1">
                  {product.description}
                </p>
              )}

              {/* Details */}
              <div className="bg-dark-elevated border border-border p-4 mb-6 space-y-3">
                {product.era && (
                  <div className="flex justify-between items-center">
                    <span className="font-montserrat text-[9px] tracking-[0.3em] uppercase text-muted-foreground">Эпоха</span>
                    <span className="font-montserrat text-xs text-foreground">{product.era}</span>
                  </div>
                )}
                {product.category && (
                  <div className="flex justify-between items-center">
                    <span className="font-montserrat text-[9px] tracking-[0.3em] uppercase text-muted-foreground">Категория</span>
                    <span className="font-montserrat text-xs text-foreground">{product.category}</span>
                  </div>
                )}
                <div className="flex justify-between items-center border-t border-border pt-3">
                  <span className="font-montserrat text-[9px] tracking-[0.3em] uppercase text-muted-foreground">Наличие</span>
                  <span className="font-montserrat text-xs text-green-400 flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 bg-green-400 rounded-full inline-block" />
                    В наличии
                  </span>
                </div>
              </div>

              {/* Price & CTA */}
              <div className="flex items-center justify-between mb-4">
                <span className="font-cormorant text-4xl text-gold font-light">
                  {formatPrice(product.price)}
                </span>
              </div>

              <button
                onClick={handleAdd}
                className={`w-full flex items-center justify-center gap-2 font-montserrat text-xs tracking-[0.3em] uppercase py-4 transition-all duration-300 ${
                  added
                    ? "bg-gold/20 border border-gold text-gold"
                    : "gold-gradient text-dark-base hover:opacity-90"
                }`}
              >
                <Icon name={added ? "Check" : "ShoppingBag"} size={14} />
                {added ? "Добавлено в корзину" : "В корзину"}
              </button>

              <button
                onClick={onClose}
                className="mt-3 w-full border border-border text-muted-foreground font-montserrat text-xs tracking-[0.3em] uppercase py-3 hover:border-gold/40 hover:text-gold transition-all duration-300"
              >
                Продолжить покупки
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ProductModal;
