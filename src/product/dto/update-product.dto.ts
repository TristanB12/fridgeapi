import { IsString, IsNumber, IsOptional } from 'class-validator';
import { QuantityType } from "@prisma/client"
import { Type } from 'class-transformer';

export class UpdateProductDto {
  @IsString()
  @IsOptional()
  name: string

  @IsOptional()
  expiry_date: Date

  @IsNumber()
  @IsOptional()
  quantity: number

  @IsOptional()
  quantity_type: QuantityType
}