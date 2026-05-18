const HERO_IMG =
  "https://cdn.poehali.dev/projects/6c64a30b-64f4-450f-b32f-5933dbf60ce9/files/919a48c1-c3c9-42b4-b833-5a231235bf9c.jpg";

type HeroProps = {
  setActivePage: (page: string) => void;
};

const HeroSection = ({ setActivePage }: HeroProps) => {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0">
        <img
          src={HERO_IMG}
          alt="Антикварный дом"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-dark-base/80 via-dark-base/60 to-dark-base" />
        <div className="absolute inset-0 bg-gradient-to-r from-dark-base/60 via-transparent to-dark-base/40" />
      </div>

      {/* Decorative lines */}
      <div className="absolute left-8 top-1/2 -translate-y-1/2 h-32 w-px bg-gradient-to-b from-transparent via-gold/40 to-transparent hidden xl:block" />
      <div className="absolute right-8 top-1/2 -translate-y-1/2 h-32 w-px bg-gradient-to-b from-transparent via-gold/40 to-transparent hidden xl:block" />

      {/* Content */}
      <div className="relative z-10 text-center px-6 max-w-4xl mx-auto">
        <div className="animate-fade-in-up">
          <p className="font-montserrat text-[10px] tracking-[0.6em] uppercase text-gold mb-8">
            — Избранный антиквариат —
          </p>
        </div>

        <div className="animate-fade-in-up animate-delay-200">
          <h1 className="font-cormorant text-6xl md:text-8xl font-light text-foreground leading-[0.9] mb-6">
            Предметы{" "}
            <em className="italic text-gold not-italic" style={{ fontStyle: "italic" }}>
              с историей
            </em>
            <br />
            и душой
          </h1>
        </div>

        <div className="animate-fade-in-up animate-delay-400">
          <p className="font-montserrat text-sm tracking-widest text-foreground/60 max-w-xl mx-auto leading-relaxed mb-12">
            Коллекция редких антикварных предметов, ювелирных украшений
            и произведений искусства. Каждый экспонат — уникальная история.
          </p>
        </div>

        <div className="animate-fade-in-up animate-delay-600 flex flex-col sm:flex-row gap-4 justify-center">
          <button
            onClick={() => setActivePage("catalog")}
            className="gold-gradient text-dark-base font-montserrat text-xs tracking-[0.3em] uppercase px-10 py-4 hover:opacity-90 transition-all duration-300 hover:shadow-[0_0_30px_rgba(200,160,60,0.4)]"
          >
            Просмотреть каталог
          </button>
          <button
            onClick={() => setActivePage("about")}
            className="border border-gold/40 text-gold font-montserrat text-xs tracking-[0.3em] uppercase px-10 py-4 hover:border-gold hover:bg-gold/5 transition-all duration-300"
          >
            О нашем доме
          </button>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 animate-bounce">
        <div className="w-px h-10 bg-gradient-to-b from-gold/60 to-transparent" />
        <span className="font-montserrat text-[9px] tracking-[0.4em] uppercase text-gold/50">
          scroll
        </span>
      </div>
    </section>
  );
};

export default HeroSection;
