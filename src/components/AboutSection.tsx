const HERO_IMG =
  "https://cdn.poehali.dev/projects/6c64a30b-64f4-450f-b32f-5933dbf60ce9/files/919a48c1-c3c9-42b4-b833-5a231235bf9c.jpg";

type AboutProps = {
  setActivePage: (page: string) => void;
  fullPage?: boolean;
};

const AboutSection = ({ setActivePage, fullPage = false }: AboutProps) => {
  return (
    <section className={`${fullPage ? "pt-32" : "py-24"} pb-24 bg-dark-surface`}>
      <div className="max-w-7xl mx-auto px-6">
        {fullPage && (
          <div className="text-center mb-16">
            <p className="font-montserrat text-[10px] tracking-[0.6em] uppercase text-gold mb-4">
              — История дома —
            </p>
            <h2 className="font-cormorant text-5xl md:text-6xl font-light text-foreground">
              О нас
            </h2>
            <div className="section-divider mt-6 max-w-xs mx-auto" />
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* Image */}
          <div className="relative">
            <div className="aspect-[3/4] overflow-hidden">
              <img
                src={HERO_IMG}
                alt="Антикварный дом"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="absolute -bottom-6 -right-6 border border-gold/30 w-full h-full top-6 left-6 -z-10" />
            <div className="absolute bottom-8 left-8 bg-dark-base/90 border border-gold/30 p-6 backdrop-blur-sm">
              <div className="font-cormorant text-4xl text-gold font-light">37</div>
              <div className="font-montserrat text-[9px] tracking-[0.3em] uppercase text-muted-foreground mt-1">
                лет на рынке
              </div>
            </div>
          </div>

          {/* Text */}
          <div>
            {!fullPage && (
              <>
                <p className="font-montserrat text-[10px] tracking-[0.6em] uppercase text-gold mb-6">
                  — О нашем доме —
                </p>
                <h2 className="font-cormorant text-4xl md:text-5xl font-light text-foreground mb-8 leading-tight">
                  Традиции и страсть
                  <br />
                  <em style={{ fontStyle: "italic" }}>к подлинному</em>
                </h2>
              </>
            )}

            {fullPage && (
              <h3 className="font-cormorant text-3xl md:text-4xl font-light text-foreground mb-8 leading-tight">
                Традиции и страсть
                <br />
                <em style={{ fontStyle: "italic" }}>к подлинному</em>
              </h3>
            )}

            <div className="space-y-5 text-foreground/70 font-montserrat text-sm leading-relaxed">
              <p>
                Антикварный Дом основан в 1987 году страстными коллекционерами,
                убеждёнными, что каждый подлинный предмет несёт в себе частицу
                прошедшей эпохи.
              </p>
              <p>
                За три с половиной десятилетия мы сформировали репутацию надёжного
                партнёра для частных коллекционеров, музеев и интерьерных дизайнеров
                по всей России и за рубежом.
              </p>
              <p>
                Каждый предмет нашей коллекции проходит строгую экспертизу
                подлинности. Мы сотрудничаем с ведущими искусствоведами и
                реставраторами страны.
              </p>
            </div>

            <div className="grid grid-cols-3 gap-6 mt-10 pt-10 border-t border-border">
              {[
                { num: "2 500+", label: "Проданных лотов" },
                { num: "150+", label: "Постоянных клиентов" },
                { num: "12", label: "Международных выставок" },
              ].map((stat) => (
                <div key={stat.label}>
                  <div className="font-cormorant text-3xl text-gold font-light">
                    {stat.num}
                  </div>
                  <div className="font-montserrat text-[9px] tracking-[0.2em] uppercase text-muted-foreground mt-1">
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>

            {!fullPage && (
              <button
                onClick={() => setActivePage("about")}
                className="mt-10 border border-gold/40 text-gold font-montserrat text-xs tracking-[0.3em] uppercase px-8 py-3 hover:border-gold hover:bg-gold/5 transition-all duration-300"
              >
                Читать больше
              </button>
            )}
          </div>
        </div>

        {fullPage && (
          <div className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: "🔍",
                title: "Экспертиза",
                text: "Все предметы проходят многоуровневую проверку подлинности с привлечением сертифицированных экспертов.",
              },
              {
                icon: "🛡️",
                title: "Гарантия",
                text: "Полная гарантия подлинности каждого приобретённого предмета. Документы и сертификаты прилагаются.",
              },
              {
                icon: "📦",
                title: "Упаковка",
                text: "Профессиональная музейная упаковка и страхование при транспортировке по России и за рубеж.",
              },
            ].map((item) => (
              <div
                key={item.title}
                className="border border-border p-8 hover:border-gold/40 transition-colors duration-300"
              >
                <div className="text-3xl mb-4">{item.icon}</div>
                <h4 className="font-cormorant text-xl text-foreground mb-3">
                  {item.title}
                </h4>
                <p className="font-montserrat text-xs text-muted-foreground leading-relaxed">
                  {item.text}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default AboutSection;
