import { IsString, IsNumber, IsOptional, IsEnum } from 'class-validator';
import { ProductStatus, QuantityType } from "@prisma/client"

export class UpdateProductDto {
  @IsString()
  @IsOptional()
  name: string

  @IsOptional()
  expiry_date: Date

  @IsNumber()
  @IsOptional()
  quantity: number

  @IsEnum(QuantityType)
  @IsOptional()
  quantity_type: QuantityType

  @IsEnum(ProductStatus)
  @IsOptional()
  status: ProductStatus
}