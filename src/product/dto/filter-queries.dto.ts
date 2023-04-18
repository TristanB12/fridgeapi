import { ProductStatus } from "@prisma/client";
import { IsEnum, IsOptional } from "class-validator";

export class FilterQueriesDto {
  @IsOptional()
  @IsEnum(ProductStatus)
  status: ProductStatus
}