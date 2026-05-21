import { Link } from "react-router-dom"
import { useI18n } from "../i18n"

export default function Footer() {
  const years = new Date().getFullYear()
  const { t } = useI18n()
  const isMobile = window.innerWidth < 768

  return (
    <footer className="bg-forest-deep border-t border-white/5 py-12 md:py-16">
      <div className="max-w-[95%] md:max-w-[90%] mx-auto px-4 md:px-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 mb-12 items-start">
          <div className="lg:col-span-7">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-10 mt-8 md:mt-10">
              <div className="flex flex-col items-start gap-2 mb-6">
                <div className="h-6 w-6 rounded-full bg-gradient-to-br from-gold-accent/40 to-gold-accent/10 border border-gold-accent/30" />
                <span className="font-display text-xl text-cream tracking-wide">Evergreen</span>
                <p className="text-cream/40 max-w-sm text-sm leading-relaxed font-light">{t("footer.brandText")}</p>
              </div>

              <div className="max-w-xs">
                <h4 className="text-cream/70 font-bold mb-6 text-xs uppercase tracking-[0.15em]">{t("footer.navigation")}</h4>
                <ul className="space-y-4 text-sm text-cream/40">
                  {[
                    { label: t("nav.home"), to: "/" },
                    { label: t("nav.about"), to: "/sobre-nosotros" },
                    { label: t("nav.order"), to: "/encargos" },
                    { label: t("nav.orderInfo"), to: "/informacion-de-encargo" },
                    { label: t("nav.gallery"), to: "/galeria" },
                    { label: t("nav.news"), to: "/noticias" },
                  ].map((item) => (
                    <li key={item.label + item.to}>
                      <Link className="hover:text-gold-accent transition-colors duration-300" to={item.to}>
                        {item.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="max-w-xs">
                <h4 className="text-cream/70 font-bold mb-6 text-xs uppercase tracking-[0.15em]">{t("footer.social")}</h4>
                <ul className="space-y-4 text-sm text-cream/40">
                  {["Instagram", "Pinterest", "Facebook"].map((link) => (
                    <li key={link}>
                      <a className="hover:text-gold-accent transition-colors duration-300" href="#">
                        {link}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          <div className="lg:col-span-5">
            <div className="rounded-3xl overflow-hidden border border-gold-accent/30 bg-forest-mid/60 shadow-[0_0_40px_rgba(197,160,89,0.16)]">
              <video className="w-full h-[320px] md:h-[380px] object-cover" autoPlay muted loop playsInline>
                <source src={isMobile ? "/promoMovil.webm" : "/promo.webm"} type="video/webm" />
              </video>
            </div>
          </div>
        </div>

        <div className="pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-cream/30">
          <div>&copy; {years} Evergreen Cold Ceramics. {t("footer.rights")}</div>
        </div>
      </div>
    </footer>
  )
}
