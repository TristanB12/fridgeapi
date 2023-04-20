import {IsNotEmpty, IsString, IsNumber, IsOptional, IsEnum } from 'class-validator';
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

  @IsEnum(QuantityType)
  @IsOptional()
  quantity_type: QuantityType
}