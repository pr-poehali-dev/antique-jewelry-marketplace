import Icon from "@/components/ui/icon";
import type { CartItem } from "@/pages/Index";

type CartDrawerProps = {
  open: boolean;
  onClose: () => void;
  items: CartItem[];
  onRemove: (id: number) => void;
  onUpdateQty: (id: number, qty: number) => void;
  onCheckout: () => void;
};

const CartDrawer = ({ open, onClose, items, onRemove, onUpdateQty, onCheckout }: CartDrawerProps) => {
  const total = items.reduce((sum, i) => sum + i.price * i.quantity, 0);

  const formatPrice = (price: number) =>
    price.toLocaleString("ru-RU") + " ₽";

  if (!open) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-dark-base/80 backdrop-blur-sm z-50"
        onClick={onClose}
      />

      {/* Drawer */}
      <div className="fixed top-0 right-0 bottom-0 w-full max-w-md bg-dark-surface border-l border-border z-50 flex flex-col animate-slide-in-right">
        {/* Header */}
        <div className="flex items-center justify-between px-8 py-6 border-b border-border">
          <div>
            <h3 className="font-cormorant text-2xl font-light text-foreground">
              Корзина
            </h3>
            <p className="font-montserrat text-[10px] tracking-[0.2em] text-muted-foreground uppercase mt-1">
              {items.length > 0 ? `${items.length} предмета` : "Пусто"}
            </p>
          </div>
          <button
            onClick={onClose}
            className="w-9 h-9 border border-border flex items-center justify-center text-muted-foreground hover:text-gold hover:border-gold/50 transition-all duration-300"
          >
            <Icon name="X" size={16} />
          </button>
        </div>

        {/* Items */}
        <div className="flex-1 overflow-y-auto px-8 py-6">
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center">
              <Icon name="ShoppingBag" size={40} className="text-gold/20 mb-4" />
              <p className="font-cormorant text-xl text-foreground/40 font-light">
                Корзина пуста
              </p>
              <p className="font-montserrat text-xs text-muted-foreground mt-2">
                Добавьте предметы из каталога
              </p>
            </div>
          ) : (
            <div className="space-y-6">
              {items.map((item) => (
                <div
                  key={item.id}
                  className="flex gap-4 pb-6 border-b border-border last:border-0"
                >
                  <div className="w-20 h-20 overflow-hidden flex-shrink-0">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-cormorant text-base font-light text-foreground leading-tight mb-1">
                      {item.name}
                    </h4>
                    <p className="font-cormorant text-lg text-gold font-light">
                      {formatPrice(item.price)}
                    </p>

                    <div className="flex items-center justify-between mt-3">
                      <div className="flex items-center border border-border">
                        <button
                          onClick={() => onUpdateQty(item.id, item.quantity - 1)}
                          className="w-7 h-7 flex items-center justify-center text-muted-foreground hover:text-gold transition-colors"
                        >
                          <Icon name="Minus" size={12} />
                        </button>
                        <span className="w-8 text-center font-montserrat text-xs text-foreground">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => onUpdateQty(item.id, item.quantity + 1)}
                          className="w-7 h-7 flex items-center justify-center text-muted-foreground hover:text-gold transition-colors"
                        >
                          <Icon name="Plus" size={12} />
                        </button>
                      </div>
                      <button
                        onClick={() => onRemove(item.id)}
                        className="text-muted-foreground hover:text-destructive transition-colors"
                      >
                        <Icon name="Trash2" size={14} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <div className="px-8 py-6 border-t border-border">
            <div className="flex items-center justify-between mb-6">
              <span className="font-montserrat text-xs tracking-widest uppercase text-muted-foreground">
                Итого
              </span>
              <span className="font-cormorant text-2xl text-gold font-light">
                {formatPrice(total)}
              </span>
            </div>
            <button
              onClick={onCheckout}
              className="w-full gold-gradient text-dark-base font-montserrat text-xs tracking-[0.3em] uppercase py-4 hover:opacity-90 transition-all duration-300"
            >
              Оформить заказ
            </button>
            <p className="font-montserrat text-[10px] text-muted-foreground text-center mt-3">
              Доставка рассчитывается при оформлении
            </p>
          </div>
        )}
      </div>
    </>
  );
};

export default CartDrawer;
