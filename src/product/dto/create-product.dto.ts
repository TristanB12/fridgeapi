import {IsNotEmpty, IsString, IsNumber, IsOptional } from 'class-validator';
import { QuantityType } from "@prisma/client"

export class CreateProductDto {
  @IsString()
  @IsNotEmpty()
  name: string

  @IsNotEmpty()
  expiry_date: Date

  @IsNumber()
  @IsOptional()
  quantity: number

  @IsOptional()
  quantity_type: QuantityType
}