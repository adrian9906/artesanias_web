export default function BrandName({ className = '' }) {
  return (
    <span
      aria-label="Thay Art"
      className={`brand-name inline-flex items-baseline whitespace-nowrap text-cream ${className}`}
    >
      <span aria-hidden="true" className="brand-thay text-[#F9ACA2]">Thay</span>
      <span aria-hidden="true" className="brand-art text-[#F9ACA2]">Art</span>
    </span>
  )
}
