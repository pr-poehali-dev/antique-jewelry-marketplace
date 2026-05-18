import Icon from "@/components/ui/icon";

const deliveryOptions = [
  {
    icon: "Truck",
    title: "Курьерская доставка",
    subtitle: "по Москве и МО",
    price: "от 1 500 ₽",
    time: "1–2 дня",
    description:
      "Доставка специализированным транспортом с профессиональной упаковкой. Курьер созвонится за час до прибытия.",
  },
  {
    icon: "Package",
    title: "Транспортная компания",
    subtitle: "по всей России",
    price: "от 3 000 ₽",
    time: "3–10 дней",
    description:
      "Отправка через проверенные транспортные компании в музейной упаковке с полным страхованием груза.",
  },
  {
    icon: "Globe",
    title: "Международная доставка",
    subtitle: "за рубеж",
    price: "по запросу",
    time: "10–21 день",
    description:
      "Оформление всех таможенных документов, сертификатов экспорта и страхования. Обсуждается индивидуально.",
  },
  {
    icon: "MapPin",
    title: "Самовывоз",
    subtitle: "из нашего салона",
    price: "Бесплатно",
    time: "в день обращения",
    description:
      "Самовывоз из нашего салона в Москве. Возможен осмотр предмета и получение всех документов лично.",
  },
];

const paymentOptions = [
  {
    icon: "CreditCard",
    title: "Банковская карта",
    description: "Visa, Mastercard, МИР — онлайн на сайте или в салоне через терминал.",
  },
  {
    icon: "Building2",
    title: "Банковский перевод",
    description: "Для юридических лиц и крупных сделок. Счёт выставляется в течение часа.",
  },
  {
    icon: "Banknote",
    title: "Наличные",
    description: "Оплата наличными при самовывозе или курьерской доставке по Москве.",
  },
];

const DeliverySection = () => {
  return (
    <section className="pt-32 pb-20 min-h-screen">
      <div className="max-w-7xl mx-auto px-6">
        {/* Title */}
        <div className="text-center mb-16">
          <p className="font-montserrat text-[10px] tracking-[0.6em] uppercase text-gold mb-4">
            — Всё под контролем —
          </p>
          <h2 className="font-cormorant text-5xl md:text-6xl font-light text-foreground">
            Доставка и оплата
          </h2>
          <div className="section-divider mt-6 max-w-xs mx-auto" />
        </div>

        {/* Delivery */}
        <h3 className="font-cormorant text-3xl font-light text-foreground mb-8">
          Способы доставки
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-16">
          {deliveryOptions.map((opt) => (
            <div
              key={opt.title}
              className="border border-border p-8 hover:border-gold/40 transition-all duration-300 group"
            >
              <div className="flex items-start gap-5">
                <div className="w-12 h-12 border border-gold/30 flex items-center justify-center flex-shrink-0 group-hover:border-gold transition-colors duration-300">
                  <Icon name={opt.icon} size={20} className="text-gold" />
                </div>
                <div className="flex-1">
                  <div className="flex items-start justify-between gap-4 mb-1">
                    <div>
                      <h4 className="font-cormorant text-xl text-foreground font-light">
                        {opt.title}
                      </h4>
                      <p className="font-montserrat text-[10px] tracking-[0.2em] uppercase text-gold/60">
                        {opt.subtitle}
                      </p>
                    </div>
                    <div className="text-right">
                      <div className="font-cormorant text-lg text-gold">
                        {opt.price}
                      </div>
                      <div className="font-montserrat text-[10px] text-muted-foreground">
                        {opt.time}
                      </div>
                    </div>
                  </div>
                  <p className="font-montserrat text-xs text-muted-foreground leading-relaxed mt-3">
                    {opt.description}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="section-divider mb-16" />

        {/* Payment */}
        <h3 className="font-cormorant text-3xl font-light text-foreground mb-8">
          Способы оплаты
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
          {paymentOptions.map((opt) => (
            <div
              key={opt.title}
              className="border border-border p-8 hover:border-gold/40 transition-all duration-300 group"
            >
              <Icon name={opt.icon} size={24} className="text-gold mb-4" />
              <h4 className="font-cormorant text-xl text-foreground font-light mb-2">
                {opt.title}
              </h4>
              <p className="font-montserrat text-xs text-muted-foreground leading-relaxed">
                {opt.description}
              </p>
            </div>
          ))}
        </div>

        {/* Note */}
        <div className="border border-gold/20 bg-gold/5 p-8">
          <div className="flex gap-4">
            <Icon name="Shield" size={24} className="text-gold flex-shrink-0 mt-1" />
            <div>
              <h4 className="font-cormorant text-xl text-foreground font-light mb-2">
                Страхование и гарантии
              </h4>
              <p className="font-montserrat text-xs text-muted-foreground leading-relaxed">
                Все предметы при транспортировке застрахованы на полную стоимость.
                К каждому лоту прилагается сертификат подлинности, экспертное заключение
                и полный пакет документов. Возврат возможен в течение 14 дней при
                несоответствии описанию.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default DeliverySection;