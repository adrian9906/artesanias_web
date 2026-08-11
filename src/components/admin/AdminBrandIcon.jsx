import Image from "next/image"
import { cn } from "@/lib/utils"

export default function AdminBrandIcon({ className }) {
  return (
    <Image
      src="/images/admin/thay-art-icon.png"
      alt=""
      aria-hidden="true"
      width={64}
      height={64}
      className={cn("shrink-0 object-contain", className)}
    />
  )
}
