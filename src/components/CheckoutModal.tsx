import { useState } from "react";
import Icon from "@/components/ui/icon";
import type { CartItem } from "@/pages/Index";

type CheckoutModalProps = {
  open: boolean;
  onClose: () => void;
  items: CartItem[];
  onSuccess: () => void;
};

const CheckoutModal = ({ open, onClose, items, onSuccess }: CheckoutModalProps) => {
  const [step, setStep] = useState<"form" | "success">("form");
  const [form, setForm] = useState({
    name: "",
    phone: "",
    email: "",
    delivery: "courier",
    address: "",
    comment: "",
  });

  const total = items.reduce((sum, i) => sum + i.price * i.quantity, 0);
  const formatPrice = (price: number) => price.toLocaleString("ru-RU") + " ₽";

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setStep("success");
    setTimeout(() => {
      onSuccess();
      setStep("form");
    }, 3000);
  };

  if (!open) return null;

  return (
    <>
      <div
        className="fixed inset-0 bg-dark-base/90 backdrop-blur-md z-50"
        onClick={onClose}
      />
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div className="bg-dark-surface border border-border w-full max-w-2xl max-h-[90vh] overflow-y-auto animate-fade-in">
          {step === "success" ? (
            <div className="p-12 text-center">
              <div className="w-20 h-20 border border-gold/40 flex items-center justify-center mx-auto mb-6">
                <Icon name="Check" size={32} className="text-gold" />
              </div>
              <h3 className="font-cormorant text-3xl text-foreground font-light mb-3">
                Заказ принят
              </h3>
              <p className="font-montserrat text-sm text-muted-foreground">
                Наш менеджер свяжется с вами в течение часа для подтверждения
              </p>
            </div>
          ) : (
            <>
              {/* Header */}
              <div className="flex items-center justify-between px-8 py-6 border-b border-border">
                <h3 className="font-cormorant text-2xl font-light text-foreground">
                  Оформление заказа
                </h3>
                <button
                  onClick={onClose}
                  className="w-9 h-9 border border-border flex items-center justify-center text-muted-foreground hover:text-gold hover:border-gold/50 transition-all duration-300"
                >
                  <Icon name="X" size={16} />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="p-8">
                {/* Order summary */}
                <div className="bg-dark-elevated border border-border p-5 mb-8">
                  <p className="font-montserrat text-[9px] tracking-[0.3em] uppercase text-gold/60 mb-3">
                    Ваш заказ
                  </p>
                  <div className="space-y-2">
                    {items.map((item) => (
                      <div key={item.id} className="flex justify-between">
                        <span className="font-montserrat text-xs text-foreground/70">
                          {item.name} × {item.quantity}
                        </span>
                        <span className="font-cormorant text-base text-gold font-light">
                          {formatPrice(item.price * item.quantity)}
                        </span>
                      </div>
                    ))}
                  </div>
                  <div className="border-t border-border mt-3 pt-3 flex justify-between">
                    <span className="font-montserrat text-xs uppercase tracking-widest text-muted-foreground">
                      Итого
                    </span>
                    <span className="font-cormorant text-xl text-gold font-light">
                      {formatPrice(total)}
                    </span>
                  </div>
                </div>

                {/* Form fields */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-5">
                  <div>
                    <label className="font-montserrat text-[9px] tracking-[0.3em] uppercase text-gold/60 block mb-2">
                      Имя и фамилия *
                    </label>
                    <input
                      type="text"
                      required
                      value={form.name}
                      onChange={(e) => setForm({ ...form, name: e.target.value })}
                      className="w-full bg-transparent border border-border px-4 py-3 font-montserrat text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-gold/60 transition-colors"
                      placeholder="Иван Иванов"
                    />
                  </div>
                  <div>
                    <label className="font-montserrat text-[9px] tracking-[0.3em] uppercase text-gold/60 block mb-2">
                      Телефон *
                    </label>
                    <input
                      type="tel"
                      required
                      value={form.phone}
                      onChange={(e) => setForm({ ...form, phone: e.target.value })}
                      className="w-full bg-transparent border border-border px-4 py-3 font-montserrat text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-gold/60 transition-colors"
                      placeholder="+7 (___) ___-__-__"
                    />
                  </div>
                </div>

                <div className="mb-5">
                  <label className="font-montserrat text-[9px] tracking-[0.3em] uppercase text-gold/60 block mb-2">
                    Email
                  </label>
                  <input
                    type="email"
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    className="w-full bg-transparent border border-border px-4 py-3 font-montserrat text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-gold/60 transition-colors"
                    placeholder="ivan@email.ru"
                  />
                </div>

                <div className="mb-5">
                  <label className="font-montserrat text-[9px] tracking-[0.3em] uppercase text-gold/60 block mb-3">
                    Способ доставки *
                  </label>
                  <div className="grid grid-cols-2 gap-3">
                    {[
                      { value: "courier", label: "Курьером" },
                      { value: "pickup", label: "Самовывоз" },
                    ].map((opt) => (
                      <button
                        key={opt.value}
                        type="button"
                        onClick={() => setForm({ ...form, delivery: opt.value })}
                        className={`py-3 border font-montserrat text-xs tracking-widest uppercase transition-all duration-300 ${
                          form.delivery === opt.value
                            ? "border-gold bg-gold/10 text-gold"
                            : "border-border text-muted-foreground hover:border-gold/40"
                        }`}
                      >
                        {opt.label}
                      </button>
                    ))}
                  </div>
                </div>

                {form.delivery === "courier" && (
                  <div className="mb-5">
                    <label className="font-montserrat text-[9px] tracking-[0.3em] uppercase text-gold/60 block mb-2">
                      Адрес доставки *
                    </label>
                    <input
                      type="text"
                      required
                      value={form.address}
                      onChange={(e) => setForm({ ...form, address: e.target.value })}
                      className="w-full bg-transparent border border-border px-4 py-3 font-montserrat text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-gold/60 transition-colors"
                      placeholder="Город, улица, дом, квартира"
                    />
                  </div>
                )}

                <div className="mb-8">
                  <label className="font-montserrat text-[9px] tracking-[0.3em] uppercase text-gold/60 block mb-2">
                    Комментарий к заказу
                  </label>
                  <textarea
                    value={form.comment}
                    onChange={(e) => setForm({ ...form, comment: e.target.value })}
                    rows={3}
                    className="w-full bg-transparent border border-border px-4 py-3 font-montserrat text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-gold/60 transition-colors resize-none"
                    placeholder="Любые пожелания к заказу..."
                  />
                </div>

                <button
                  type="submit"
                  className="w-full gold-gradient text-dark-base font-montserrat text-xs tracking-[0.3em] uppercase py-4 hover:opacity-90 transition-all duration-300"
                >
                  Подтвердить заказ
                </button>
                <p className="font-montserrat text-[10px] text-muted-foreground text-center mt-3">
                  Нажимая кнопку, вы соглашаетесь с условиями продажи
                </p>
              </form>
            </>
          )}
        </div>
      </div>
    </>
  );
};

export default CheckoutModal;
