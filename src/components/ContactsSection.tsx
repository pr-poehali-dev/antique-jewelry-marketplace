import { useState } from "react";
import Icon from "@/components/ui/icon";

const ContactsSection = () => {
  const [form, setForm] = useState({ name: "", phone: "", message: "" });
  const [sent, setSent] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSent(true);
  };

  return (
    <section className="pt-32 pb-20 min-h-screen">
      <div className="max-w-7xl mx-auto px-6">
        {/* Title */}
        <div className="text-center mb-16">
          <p className="font-montserrat text-[10px] tracking-[0.6em] uppercase text-gold mb-4">
            — Мы всегда рядом —
          </p>
          <h2 className="font-cormorant text-5xl md:text-6xl font-light text-foreground">
            Контакты
          </h2>
          <div className="section-divider mt-6 max-w-xs mx-auto" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
          {/* Left - Info */}
          <div>
            <h3 className="font-cormorant text-3xl font-light text-foreground mb-8">
              Свяжитесь с нами
            </h3>

            <div className="space-y-8 mb-12">
              {[
                {
                  icon: "MapPin",
                  label: "Адрес",
                  value: "Москва, ул. Арбат, 24",
                  sub: "Ежедневно 11:00–20:00",
                },
                {
                  icon: "Phone",
                  label: "Телефон",
                  value: "+7 (495) 123-45-67",
                  sub: "Звонки и WhatsApp",
                },
                {
                  icon: "Mail",
                  label: "Email",
                  value: "info@antique-house.ru",
                  sub: "Ответим в течение дня",
                },
              ].map((item) => (
                <div key={item.label} className="flex gap-5 items-start">
                  <div className="w-10 h-10 border border-gold/30 flex items-center justify-center flex-shrink-0">
                    <Icon name={item.icon} size={16} className="text-gold" />
                  </div>
                  <div>
                    <p className="font-montserrat text-[9px] tracking-[0.3em] uppercase text-gold/60 mb-1">
                      {item.label}
                    </p>
                    <p className="font-cormorant text-xl text-foreground font-light">
                      {item.value}
                    </p>
                    <p className="font-montserrat text-xs text-muted-foreground">
                      {item.sub}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            <div className="border-t border-border pt-8">
              <p className="font-montserrat text-[10px] tracking-[0.3em] uppercase text-gold/60 mb-4">
                Мы в социальных сетях
              </p>
              <div className="flex gap-3">
                {["telegram", "vk", "instagram"].map((soc) => (
                  <button
                    key={soc}
                    className="w-10 h-10 border border-border hover:border-gold/50 flex items-center justify-center text-muted-foreground hover:text-gold transition-all duration-300 font-montserrat text-[10px] uppercase"
                  >
                    {soc === "telegram" && <Icon name="Send" size={14} />}
                    {soc === "vk" && <Icon name="Globe" size={14} />}
                    {soc === "instagram" && <Icon name="Camera" size={14} />}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Right - Form */}
          <div>
            <h3 className="font-cormorant text-3xl font-light text-foreground mb-8">
              Напишите нам
            </h3>

            {sent ? (
              <div className="border border-gold/30 bg-gold/5 p-10 text-center">
                <div className="w-14 h-14 border border-gold/50 flex items-center justify-center mx-auto mb-6">
                  <Icon name="Check" size={24} className="text-gold" />
                </div>
                <h4 className="font-cormorant text-2xl text-foreground mb-2">
                  Сообщение отправлено
                </h4>
                <p className="font-montserrat text-xs text-muted-foreground">
                  Мы свяжемся с вами в течение рабочего дня
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <label className="font-montserrat text-[9px] tracking-[0.3em] uppercase text-gold/60 block mb-2">
                    Ваше имя
                  </label>
                  <input
                    type="text"
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    required
                    className="w-full bg-transparent border border-border px-4 py-3 font-montserrat text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-gold/60 transition-colors"
                    placeholder="Иван Иванов"
                  />
                </div>
                <div>
                  <label className="font-montserrat text-[9px] tracking-[0.3em] uppercase text-gold/60 block mb-2">
                    Телефон
                  </label>
                  <input
                    type="tel"
                    value={form.phone}
                    onChange={(e) => setForm({ ...form, phone: e.target.value })}
                    required
                    className="w-full bg-transparent border border-border px-4 py-3 font-montserrat text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-gold/60 transition-colors"
                    placeholder="+7 (___) ___-__-__"
                  />
                </div>
                <div>
                  <label className="font-montserrat text-[9px] tracking-[0.3em] uppercase text-gold/60 block mb-2">
                    Сообщение
                  </label>
                  <textarea
                    value={form.message}
                    onChange={(e) => setForm({ ...form, message: e.target.value })}
                    rows={5}
                    className="w-full bg-transparent border border-border px-4 py-3 font-montserrat text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-gold/60 transition-colors resize-none"
                    placeholder="Расскажите, чем мы можем помочь..."
                  />
                </div>
                <button
                  type="submit"
                  className="w-full gold-gradient text-dark-base font-montserrat text-xs tracking-[0.3em] uppercase py-4 hover:opacity-90 transition-all duration-300 hover:shadow-[0_0_20px_rgba(200,160,60,0.3)]"
                >
                  Отправить сообщение
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default ContactsSection;
