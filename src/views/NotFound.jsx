import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { ArrowLeft, Compass, PackagePlus } from 'lucide-react'
import { useI18n } from '../i18n'

export default function NotFound() {
  const pathname = usePathname()
  const { t } = useI18n()
  const helpItems = t('notFound.helpItems', [])

  return (
    <section className="relative min-h-[100dvh] overflow-hidden bg-forest-deep px-4 pb-16 pt-32 sm:px-6 lg:px-8">
      <div className="absolute inset-0 noise-overlay" />
      <div className="absolute left-[-8%] top-20 h-72 w-72 rounded-full bg-gold-accent/12 blur-3xl" />
      <div className="absolute bottom-10 right-[-6%] h-80 w-80 rounded-full bg-secondary-fixed/10 blur-3xl" />

      <div className="relative z-10 mx-auto flex w-full max-w-6xl flex-col gap-8 lg:grid lg:grid-cols-[1.15fr_0.85fr] lg:items-center">
        <div className="rounded-[2rem] border border-gold-accent/20 bg-forest-mid/70 p-6 shadow-[0_24px_80px_rgba(0,0,0,0.35)] backdrop-blur-md sm:p-8 lg:p-10">
          <p className="mb-4 inline-flex rounded-full border border-gold-accent/30 bg-gold-accent/10 px-4 py-2 text-[11px] uppercase tracking-[0.28em] text-gold-light">{t('notFound.badge')}</p>
          <div className="mb-6 flex items-end gap-4">
            <span className="font-bitcount text-6xl leading-none text-gold-light sm:text-7xl lg:text-8xl">{t('notFound.title')}</span>
            <div className="mb-2 h-px flex-1 bg-gradient-to-r from-gold-accent/60 to-transparent" />
          </div>
          <h1 className="max-w-2xl font-display text-3xl leading-tight text-cream sm:text-4xl lg:text-5xl">{t('notFound.subtitle')}</h1>
          <p className="mt-5 max-w-xl text-sm leading-7 text-cream/72 sm:text-base">{t('notFound.text')}</p>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
            <Link href="/" className="inline-flex min-h-11 items-center justify-center gap-2 rounded-full bg-gold-accent px-6 py-3 text-sm font-semibold text-forest-dark transition-transform duration-300 hover:scale-[1.02] hover:bg-gold-light focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-gold-light">
              <ArrowLeft size={18} />{t('notFound.primaryCta')}
            </Link>
            <Link href="/galeria" className="inline-flex min-h-11 items-center justify-center gap-2 rounded-full border border-gold-accent/35 bg-white/5 px-6 py-3 text-sm font-semibold text-cream transition-colors duration-300 hover:border-gold-accent hover:text-gold-light focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-gold-light">
              <Compass size={18} />{t('notFound.secondaryCta')}
            </Link>
            <Link href="/encargos" className="inline-flex min-h-11 items-center justify-center gap-2 rounded-full border border-white/15 bg-transparent px-6 py-3 text-sm font-semibold text-cream/80 transition-colors duration-300 hover:border-gold-accent/50 hover:text-cream focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-gold-light">
              <PackagePlus size={18} />{t('notFound.tertiaryCta')}
            </Link>
          </div>
        </div>

        <aside className="relative overflow-hidden rounded-[2rem] border border-gold-accent/20 bg-[#0a1a10]/80 p-6 shadow-[0_24px_80px_rgba(0,0,0,0.35)] backdrop-blur-md sm:p-8">
          <div className="absolute inset-x-6 top-0 h-px bg-gradient-to-r from-transparent via-gold-accent/50 to-transparent" />
          <div className="mb-8 rounded-[1.5rem] border border-gold-accent/20 bg-gradient-to-br from-gold-accent/14 via-gold-accent/6 to-transparent p-5">
            <p className="text-xs uppercase tracking-[0.24em] text-gold-accent/75">{t('notFound.currentPath')}</p>
            <code className="mt-3 block break-all font-mono text-sm text-cream/85">{pathname}</code>
          </div>
          <h2 className="font-display text-2xl text-cream">{t('notFound.helpTitle')}</h2>
          <div className="mt-6 space-y-3">
            {helpItems.map((item, index) => (
              <div key={`${item}-${index}`} className="rounded-2xl border border-white/8 bg-white/[0.03] p-4 text-sm leading-6 text-cream/72">
                <span className="mr-3 font-bitcount text-gold-light">0{index + 1}</span>{item}
              </div>
            ))}
          </div>
        </aside>
      </div>
    </section>
  )
}
