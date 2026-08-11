import Link from "next/link"
import { useI18n } from "../i18n"
import BrandName from "./BrandName"

export default function Footer() {
  const year = new Date().getFullYear()
  const { t } = useI18n()
  const links = [
    { label: t("nav.home"), href: "/" },
    { label: t("nav.catalog"), href: "/catalogo" },
    { label: t("nav.about"), href: "/sobre-nosotros" },
    { label: t("nav.orderInfo"), href: "/informacion-de-encargo" },
    { label: t("nav.gallery"), href: "/galeria" },
    { label: t("nav.news"), href: "/noticias" },
    { label: t("nav.opinions"), href: "/opiniones" },
  ]

  return (
    <footer className="bg-forest-deep border-t border-white/5 py-12 md:py-16">
      <div className="max-w-[95%] md:max-w-[90%] mx-auto px-4 md:px-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 mb-12 items-start">
          <div className="lg:col-span-7">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-10 mt-8 md:mt-10">
              <div className="flex flex-col items-start gap-2 mb-6">
                <div className="h-6 w-6 rounded-full bg-gradient-to-br from-gold-accent/40 to-gold-accent/10 border border-gold-accent/30" />
                <BrandName className="text-3xl" />
                <p className="text-cream/40 max-w-sm text-sm leading-relaxed font-light">{t("footer.brandText")}</p>
              </div>

              <div className="max-w-xs">
                <h4 className="text-cream/70 font-bold mb-6 text-xs uppercase tracking-[0.15em]">{t("footer.navigation")}</h4>
                <ul className="space-y-4 text-sm text-cream/40">
                  {links.map((item) => (
                    <li key={item.href}>
                      <Link className="hover:text-gold-accent transition-colors duration-300" href={item.href}>{item.label}</Link>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="max-w-xs">
                <h4 className="text-cream/70 font-bold mb-6 text-xs uppercase tracking-[0.15em]">{t("footer.social")}</h4>
                <ul className="space-y-4 text-sm text-cream/40">
                  <li>
                    <a
                      className="hover:text-gold-accent transition-colors duration-300 inline-flex items-center gap-3"
                      href="https://www.instagram.com/thay_artesanias?igsh=MTFkczZpM3J1cjZtdQ=="
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                        <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
                        <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                        <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
                      </svg>
                      Instagram
                    </a>
                  </li>
                  <li>
                    <a
                      className="hover:text-gold-accent transition-colors duration-300 inline-flex items-center gap-3"
                      href="mailto:leonthaymi@gmail.com"
                    >
                      <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                        <rect x="2" y="4" width="20" height="16" rx="2" />
                        <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
                      </svg>
                      leonthaymi@gmail.com
                    </a>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          <div className="lg:col-span-5">
            <div className="rounded-3xl overflow-hidden border border-gold-accent/30 bg-forest-mid/70 shadow-[0_18px_50px_rgba(249,172,162,0.14)]">
              <video className="w-full h-[320px] md:h-[380px] object-cover" autoPlay muted loop playsInline>
                <source src="/promoMovil.webm" type="video/webm" media="(max-width: 767px)" />
                <source src="/promo.webm" type="video/webm" />
              </video>
            </div>
          </div>
        </div>

        <div className="pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-cream/30">
          <div>&copy; {year} Thay Art. {t("footer.rights")}</div>
        </div>
      </div>
    </footer>
  )
}
