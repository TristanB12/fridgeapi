import { NotificationStatus, ProductStatus, QuantityType } from "@prisma/client"

export class ProductEntity {
  id: number
  name: string
  expiry_date: Date
  quantity: number
  quantity_type: QuantityType
  status: ProductStatus
  expires_in: number
  notification_status: NotificationStatus
}