import { useEffect, useState, useCallback } from "react";
import Icon from "@/components/ui/icon";
import type { CartItem } from "@/pages/Index";

const SEND_ORDER_URL = "https://functions.poehali.dev/d175d116-7b1e-4ebe-904c-2ab0fc2b9b9a";

type Product = Omit<CartItem, "quantity"> & {
  category: string;
  era: string;
  description: string;
  images?: string[];
  video_url?: string;
};

type Props = {
  product: Product | null;
  onClose: () => void;
  onAddToCart: (item: Omit<CartItem, "quantity">) => void;
};

function getEmbedUrl(url: string): string | null {
  if (!url) return null;
  const rutubeMatch = url.match(/rutube\.ru\/video\/([a-zA-Z0-9]+)/);
  if (rutubeMatch) return `https://rutube.ru/play/embed/${rutubeMatch[1]}/`;
  const ytMatch = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([a-zA-Z0-9_-]+)/);
  if (ytMatch) return `https://www.youtube.com/embed/${ytMatch[1]}`;
  const vimeoMatch = url.match(/vimeo\.com\/(\d+)/);
  if (vimeoMatch) return `https://player.vimeo.com/video/${vimeoMatch[1]}`;
  return null;
}

const EMPTY_CONTACT = { name: "", phone: "", message: "" };

const ProductModal = ({ product, onClose, onAddToCart }: Props) => {
  const [added, setAdded] = useState(false);
  const [activeIdx, setActiveIdx] = useState(0);
  const [showVideo, setShowVideo] = useState(false);
  const [showCallForm, setShowCallForm] = useState(false);
  const [contact, setContact] = useState(EMPTY_CONTACT);
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);

  const allImages = product
    ? product.images && product.images.length > 0
      ? product.images
      : product.image
      ? [product.image]
      : []
    : [];

  const embedUrl = product ? getEmbedUrl(product.video_url || "") : null;
  const mediaCount = allImages.length + (embedUrl ? 1 : 0);

  const prev = useCallback(() => {
    setShowVideo(false);
    setActiveIdx((i) => (i - 1 + allImages.length) % allImages.length);
  }, [allImages.length]);

  const next = useCallback(() => {
    setShowVideo(false);
    setActiveIdx((i) => (i + 1) % allImages.length);
  }, [allImages.length]);

  useEffect(() => {
    if (!product) return;
    setAdded(false);
    setActiveIdx(0);
    setShowVideo(false);
    setShowCallForm(false);
    setContact(EMPTY_CONTACT);
    setSent(false);

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowLeft" && allImages.length > 1 && !showCallForm) prev();
      if (e.key === "ArrowRight" && allImages.length > 1 && !showCallForm) next();
    };
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [product, onClose, allImages.length, prev, next, showCallForm]);

  if (!product) return null;

  const formatPrice = (price: number) => price.toLocaleString("ru-RU") + " ₽";

  const handleAdd = () => {
    onAddToCart({ id: product.id, name: product.name, price: product.price, image: product.image });
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  const handleSendRequest = async (e: React.FormEvent) => {
    e.preventDefault();
    setSending(true);
    await fetch(SEND_ORDER_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: contact.name,
        phone: contact.phone,
        email: "",
        delivery: "callback",
        address: "",
        comment: contact.message || `Интересует товар: ${product.name}`,
        items: [{ name: product.name, quantity: 1, price: product.price }],
        total: product.price,
      }),
    });
    setSending(false);
    setSent(true);
  };

  return (
    <>
      {/* Backdrop */}
      <div className="fixed inset-0 bg-dark-base/90 backdrop-blur-md z-50" onClick={onClose} />

      {/* Modal */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div className="bg-dark-surface border border-border w-full max-w-3xl max-h-[90vh] overflow-y-auto animate-fade-in relative">

          {/* Close */}
          <button onClick={onClose} className="absolute top-4 right-4 z-10 w-9 h-9 border border-border bg-dark-surface flex items-center justify-center text-muted-foreground hover:text-gold hover:border-gold/50 transition-all duration-300">
            <Icon name="X" size={16} />
          </button>

          <div className="grid grid-cols-1 md:grid-cols-2">

            {/* Media section */}
            <div className="relative overflow-hidden bg-dark-elevated" style={{ minHeight: 320 }}>
              {showVideo && embedUrl ? (
                <div className="w-full aspect-square">
                  <iframe src={embedUrl} className="w-full h-full" style={{ minHeight: 320 }} allowFullScreen allow="autoplay; fullscreen" frameBorder={0} />
                </div>
              ) : allImages.length > 0 ? (
                <img src={allImages[activeIdx]} alt={product.name} className="w-full h-full object-cover" style={{ minHeight: 320 }} />
              ) : (
                <div className="w-full flex items-center justify-center" style={{ minHeight: 320 }}>
                  <Icon name="Image" size={48} className="text-muted-foreground/20" />
                </div>
              )}

              {product.era && !showVideo && (
                <div className="absolute top-4 left-4">
                  <span className="font-montserrat text-[9px] tracking-[0.3em] uppercase bg-gold/90 text-dark-base px-2 py-1">{product.era}</span>
                </div>
              )}

              {allImages.length > 1 && !showVideo && (
                <>
                  <button onClick={prev} className="absolute left-2 top-1/2 -translate-y-1/2 w-8 h-8 bg-dark-base/70 border border-border flex items-center justify-center text-muted-foreground hover:text-gold hover:border-gold/50 transition-all">
                    <Icon name="ChevronLeft" size={16} />
                  </button>
                  <button onClick={next} className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 bg-dark-base/70 border border-border flex items-center justify-center text-muted-foreground hover:text-gold hover:border-gold/50 transition-all">
                    <Icon name="ChevronRight" size={16} />
                  </button>
                </>
              )}

              {mediaCount > 1 && (
                <div className="absolute bottom-0 left-0 right-0 bg-dark-base/80 backdrop-blur-sm flex gap-1.5 p-2 overflow-x-auto">
                  {allImages.map((img, i) => (
                    <button key={i} onClick={() => { setActiveIdx(i); setShowVideo(false); }} className={`flex-shrink-0 w-10 h-10 overflow-hidden border-2 transition-all ${!showVideo && activeIdx === i ? "border-gold" : "border-transparent opacity-60 hover:opacity-100"}`}>
                      <img src={img} alt="" className="w-full h-full object-cover" />
                    </button>
                  ))}
                  {embedUrl && (
                    <button onClick={() => setShowVideo(true)} className={`flex-shrink-0 w-10 h-10 border-2 flex items-center justify-center transition-all ${showVideo ? "border-gold bg-gold/20" : "border-transparent bg-dark-surface opacity-60 hover:opacity-100"}`}>
                      <Icon name="Play" size={14} className={showVideo ? "text-gold" : "text-muted-foreground"} />
                    </button>
                  )}
                </div>
              )}

              {embedUrl && mediaCount === 1 && !showVideo && (
                <button onClick={() => setShowVideo(true)} className="absolute inset-0 flex items-center justify-center bg-dark-base/40 hover:bg-dark-base/60 transition-all group">
                  <div className="w-14 h-14 bg-gold/90 flex items-center justify-center group-hover:scale-110 transition-transform">
                    <Icon name="Play" size={22} className="text-dark-base ml-1" />
                  </div>
                </button>
              )}
            </div>

            {/* Info / Call form */}
            <div className="p-8 flex flex-col">
              {!showCallForm ? (
                <>
                  {product.category && (
                    <p className="font-montserrat text-[9px] tracking-[0.4em] uppercase text-gold/60 mb-3">{product.category}</p>
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
                    {allImages.length > 1 && (
                      <div className="flex justify-between items-center">
                        <span className="font-montserrat text-[9px] tracking-[0.3em] uppercase text-muted-foreground">Фотографии</span>
                        <span className="font-montserrat text-xs text-foreground">{allImages.length} шт.</span>
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

                  <div className="mb-4">
                    <span className="font-cormorant text-4xl text-gold font-light">{formatPrice(product.price)}</span>
                  </div>

                  <button onClick={handleAdd} className={`w-full flex items-center justify-center gap-2 font-montserrat text-xs tracking-[0.3em] uppercase py-4 transition-all duration-300 ${added ? "bg-gold/20 border border-gold text-gold" : "gold-gradient text-dark-base hover:opacity-90"}`}>
                    <Icon name={added ? "Check" : "ShoppingBag"} size={14} />
                    {added ? "Добавлено в корзину" : "В корзину"}
                  </button>

                  <button
                    onClick={() => setShowCallForm(true)}
                    className="mt-3 w-full border border-border text-muted-foreground font-montserrat text-xs tracking-[0.3em] uppercase py-3 hover:border-gold/40 hover:text-gold transition-all duration-300 flex items-center justify-center gap-2"
                  >
                    <Icon name="Phone" size={13} />
                    Запросить звонок
                  </button>
                </>
              ) : (
                /* Call request form */
                <>
                  <button onClick={() => { setShowCallForm(false); setSent(false); setContact(EMPTY_CONTACT); }} className="flex items-center gap-2 text-muted-foreground hover:text-gold transition-colors font-montserrat text-[10px] tracking-[0.2em] uppercase mb-6">
                    <Icon name="ArrowLeft" size={13} />
                    Назад
                  </button>

                  {sent ? (
                    <div className="flex-1 flex flex-col items-center justify-center text-center py-8">
                      <div className="w-14 h-14 border border-gold/40 flex items-center justify-center mb-5">
                        <Icon name="Check" size={24} className="text-gold" />
                      </div>
                      <h3 className="font-cormorant text-2xl text-foreground font-light mb-3">Заявка отправлена</h3>
                      <p className="font-montserrat text-xs text-muted-foreground leading-relaxed mb-6">
                        Мы свяжемся с вами в ближайшее время по указанному номеру телефона.
                      </p>
                      <button onClick={onClose} className="gold-gradient text-dark-base font-montserrat text-xs tracking-[0.3em] uppercase px-8 py-3 hover:opacity-90 transition-all">
                        Закрыть
                      </button>
                    </div>
                  ) : (
                    <>
                      <p className="font-montserrat text-[9px] tracking-[0.4em] uppercase text-gold/60 mb-2">Обратный звонок</p>
                      <h3 className="font-cormorant text-2xl text-foreground font-light mb-1 leading-tight">
                        {product.name}
                      </h3>
                      <p className="font-cormorant text-xl text-gold font-light mb-5">{formatPrice(product.price)}</p>

                      <div className="section-divider mb-6 max-w-[40px]" />

                      <form onSubmit={handleSendRequest} className="flex flex-col gap-4 flex-1">
                        <div>
                          <label className="font-montserrat text-[9px] tracking-[0.3em] uppercase text-gold/60 block mb-2">Ваше имя *</label>
                          <input
                            required
                            value={contact.name}
                            onChange={(e) => setContact({ ...contact, name: e.target.value })}
                            className="w-full bg-dark-elevated border border-border px-4 py-3 font-montserrat text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-gold/60 transition-colors"
                            placeholder="Иван Иванов"
                          />
                        </div>
                        <div>
                          <label className="font-montserrat text-[9px] tracking-[0.3em] uppercase text-gold/60 block mb-2">Телефон *</label>
                          <input
                            required
                            type="tel"
                            value={contact.phone}
                            onChange={(e) => setContact({ ...contact, phone: e.target.value })}
                            className="w-full bg-dark-elevated border border-border px-4 py-3 font-montserrat text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-gold/60 transition-colors"
                            placeholder="+7 (___) ___-__-__"
                          />
                        </div>
                        <div>
                          <label className="font-montserrat text-[9px] tracking-[0.3em] uppercase text-gold/60 block mb-2">Сообщение</label>
                          <textarea
                            rows={3}
                            value={contact.message}
                            onChange={(e) => setContact({ ...contact, message: e.target.value })}
                            className="w-full bg-dark-elevated border border-border px-4 py-3 font-montserrat text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-gold/60 transition-colors resize-none"
                            placeholder="Ваш вопрос о товаре..."
                          />
                        </div>
                        <button
                          type="submit"
                          disabled={sending}
                          className="mt-auto gold-gradient text-dark-base font-montserrat text-xs tracking-[0.3em] uppercase py-4 hover:opacity-90 transition-all duration-300 disabled:opacity-60 flex items-center justify-center gap-2"
                        >
                          {sending ? <><Icon name="Loader2" size={14} className="animate-spin" />Отправка...</> : <><Icon name="Phone" size={14} />Перезвоните мне</>}
                        </button>
                      </form>
                    </>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ProductModal;
