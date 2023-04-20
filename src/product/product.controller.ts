import { Body, Controller, Delete, Get, Param, Post, Put, Query, UseGuards } from '@nestjs/common';
import { ProductStatus, User } from '@prisma/client';
import { GetUser } from 'src/auth/decorator';
import { JwtGuard } from 'src/auth/guard';
import { CreateProductDto, FilterQueriesDto, UpdateProductDto } from './dto';
import { ProductService } from './product.service';
import { UseInterceptors } from '@nestjs/common';
import { SentryInterceptor } from 'src/interceptors/sentry.interceptor';

@UseInterceptors(SentryInterceptor)
@UseGuards(JwtGuard)
@Controller('product')
export class ProductController {
  constructor(private productService: ProductService) {}

  @Get()
  getProducts(@GetUser() user: User, @Query() queries: FilterQueriesDto) {
    return this.productService.findManyByUser(user, queries.status);
  }

  @Post()
  createProduct(@GetUser() user: User, @Body() dto: CreateProductDto) {
    return this.productService.createForUser(user, dto);
  }

  @Put(':id')
  modifyProduct(@Param('id') productId: string, @GetUser() user: User, @Body() dto: UpdateProductDto) {
    return this.productService.updateOne(user, dto, +productId);
  }

  @Delete(':id')
  deleteProduct(@Param('id') productId: string, @GetUser() user: User) {
    return this.productService.delete(user, +productId);
  }
}
