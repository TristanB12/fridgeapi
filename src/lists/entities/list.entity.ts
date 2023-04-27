import { Exclude } from "class-transformer"
import { ProductEntity } from "src/product/entities/product.entity"

export class ListEntity {
  id: number
  name: string

  @Exclude()
  user_id: number

  products: ProductEntity[]

  constructor(partial: Partial<ListEntity>) {
    Object.assign(this, partial);
  }
}
