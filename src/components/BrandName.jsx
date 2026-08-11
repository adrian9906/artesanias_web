export default function BrandName({ className = '' }) {
  return (
    <span
      aria-label="Thay Art"
      className={`brand-name inline-flex items-baseline whitespace-nowrap text-cream ${className}`}
    >
      <span aria-hidden="true" className="brand-thay text-[var(--theme-gold-accent)]">Thay</span>
      <span aria-hidden="true" className="brand-art text-[var(--theme-gold-accent)]">Art</span>
    </span>
  )
}
