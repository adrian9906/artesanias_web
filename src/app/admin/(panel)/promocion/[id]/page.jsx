"use client"

import { useParams } from "next/navigation"
import PromotionEditor from "@/components/admin/PromotionEditor"

export default function EditPromotionPage() {
  const params = useParams()
  const promotionId = Array.isArray(params?.id) ? params.id[0] : params?.id

  return <PromotionEditor promotionId={promotionId || null} />
}
