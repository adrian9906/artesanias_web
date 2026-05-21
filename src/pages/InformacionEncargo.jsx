import { Flower, Moon, FlaskConical, Sparkles, Gem } from "lucide-react";
import { useI18n } from "../i18n";

export default function InformacionEncargo() {
  const { t } = useI18n()
  return (
    <section className="py-20 bg-forest-dark min-h-screen animate-blurred-fade-in">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-5xl pt-24">
        <div className="text-center mb-16">
          <h1 className="font-display text-4xl md:text-6xl text-cream font-bold mb-4 glow-text-primary tracking-tight">
            {t('orderInfo.title')}
          </h1>
          <h2 className="font-display text-2xl md:text-4xl text-cream mb-8">
            {t('orderInfo.subtitle')}
          </h2>
          <p className="text-cream/60 max-w-2xl mx-auto text-base leading-relaxed">
            {t('orderInfo.intro')}
          </p>
        </div>

        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="glass-card rounded-xl p-8 col-span-1 md:col-span-2 relative overflow-hidden group hover:scale-105 transition-transform duration-500 hover:border-evergreen-gold ">
              <div className="flex justify-between items-start mb-4">
                <span className="text-xs font-mono text-evergreen-gold tracking-widest uppercase">FASE 01</span>
                <Flower className="text-evergreen-gold opacity-80 w-6 h-6" />
              </div>
              <h3 className="font-display text-2xl text-cream mb-3">{t('orderInfo.phase1')}</h3>
              <p className="text-cream/50 text-sm leading-relaxed pr-12">
                {t('orderInfo.phase1Text')}
              </p>
            </div>
            <div className="glass-card rounded-xl p-8 flex flex-col justify-center text-center relative overflow-hidden group hover:border-evergreen-gold hover:scale-105 transition-transform duration-500">
              <Moon className="text-evergreen-gold text-3xl mx-auto mb-4 opacity-80 w-8 h-8" />
              <h3 className="font-display text-xl text-cream mb-2">{t('orderInfo.initialCommitment')}</h3>
              <p className="text-cream/50 text-sm leading-relaxed">
                {t('orderInfo.initialCommitmentText')}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="glass-card rounded-xl p-8 flex flex-col justify-center text-center relative overflow-hidden group hover:border-evergreen-gold hover:scale-105 transition-transform duration-500">
              <FlaskConical className="text-evergreen-gold text-3xl mx-auto mb-4 opacity-80 w-8 h-8" />
              <h3 className="font-display text-xl text-cream mb-2">{t('orderInfo.creationTimes')}</h3>
              <p className="text-cream/50 text-sm leading-relaxed">
                {t('orderInfo.creationTimesText')}
              </p>
            </div>
            <div className="glass-card rounded-xl p-8 col-span-1 md:col-span-2 relative overflow-hidden group hover:border-evergreen-gold hover:scale-105 transition-transform duration-500 flex flex-col justify-center">
              <div className="relative z-10 flex justify-between items-start mb-2">
                <div>
                  <span className="text-xs font-mono text-evergreen-gold tracking-widest uppercase mb-1 block">FASE 02</span>
                  <h3 className="font-display text-2xl text-cream mb-3">{t('orderInfo.phase2')}</h3>
                </div>
                <Sparkles className="text-evergreen-gold mt-2 opacity-80 w-6 h-6" />
              </div>
              <p className="text-cream/70 text-sm leading-relaxed w-full md:w-2/3">
                {t('orderInfo.phase2Text')}
              </p>
            </div>
          </div>

          <div className="glass-card rounded-xl p-8 relative overflow-hidden group hover:border-evergreen-gold/60 hover:scale-105 transition-transform duration-500">
            <div className="flex flex-col md:flex-row gap-8 items-center">
              <div className="w-full md:w-3/5">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <span className="text-xs font-mono text-evergreen-gold tracking-widest uppercase block mb-2">FASE 03</span>
                    <h3 className="font-display text-2xl text-cream mb-3">{t('orderInfo.phase3')}</h3>
                  </div>
                  <Gem className="text-evergreen-gold text-3xl opacity-80 hidden md:block w-8 h-8" />
                </div>
                <p className="text-cream/50 text-sm leading-relaxed mb-6">
                  {t('orderInfo.phase3Text')}
                </p>
                <div className="flex space-x-3">
                  <span className="text-[10px] font-mono text-evergreen-gold border border-evergreen-gold/30 px-3 py-1 bg-black/30 rounded uppercase tracking-wider">{t('orderInfo.internationalShipping')}</span>
                  <span className="text-[10px] font-mono text-evergreen-gold border border-evergreen-gold/30 px-3 py-1 bg-black/30 rounded uppercase tracking-wider">{t('orderInfo.premiumPackaging')}</span>
                </div>
              </div>
              <div className="w-full md:w-2/5 mt-6 md:mt-0 flex justify-end relative">
                <Gem className="text-evergreen-gold text-3xl opacity-80 md:hidden absolute -top-12 right-0 w-8 h-8" />
                <img
                  alt="Hand Holding Flowers"
                  className="rounded-lg object-cover w-full max-w-[280px] border border-white/10 shadow-lg"
                  src="/productos/promocion1.jpeg"
                />
              </div>
            </div>
          </div>
        </div>

        <div className="mt-16 glass-card rounded-xl p-12 text-center relative overflow-hidden group hover:border-evergreen-gold/60 hover:scale-105 transition-transform duration-500">
          <div className="absolute inset-0 bg-radial-gradient from-evergreen-gold-glow via-transparent to-transparent opacity-20"></div>
          <h2 className="text-3xl md:text-4xl font-display text-cream mb-4 relative z-10">
            {t('orderInfo.readyTitle')}
          </h2>
          <p className="text-cream/50 text-sm mb-8 max-w-xl mx-auto relative z-10">
            {t('orderInfo.readyText')}
          </p>
          <button className="bg-evergreen-gold hover:bg-evergreen-gold-light text-black text-sm font-semibold uppercase px-8 py-3 transition-all shadow-glow-button hover:shadow-[0_0_25px_rgba(230,193,134,0.7)] relative z-10 rounded flex items-center justify-center mx-auto space-x-2">
            <span>{t('orderInfo.startRequest')}</span>
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path d="M14 5l7 7m0 0l-7 7m7-7H3" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"></path>
            </svg>
          </button>
        </div>
      </div>
    </section>
  )
}