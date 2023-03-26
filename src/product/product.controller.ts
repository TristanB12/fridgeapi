import { Body, Controller, Delete, Get, Param, Post, Put, UseGuards } from '@nestjs/common';
import { User } from '@prisma/client';
import { GetUser } from 'src/auth/decorator';
import { JwtGuard } from 'src/auth/guard';
import { CreateProductDto, UpdateProductDto } from './dto';
import { ProductService } from './product.service';

@UseGuards(JwtGuard)
@Controller('product')
export class ProductController {
  constructor(private productService: ProductService) {}

  @Get()
  getProducts(@GetUser() user: User) {
    return this.productService.findManyByUser(user);
  }

  @Post()
  createProduct(@GetUser() user: User, @Body() dto: CreateProductDto) {
    return this.productService.createForUser(user, dto);
  }

  @Put(':id')
  modifyProduct(@Param('id') productId: string, @GetUser() user: User, @Body() dto: UpdateProductDto) {
    return this.productService.updateOne(user, dto, productId);
  }

  @Delete(':id')
  deleteProduct(@Param('id') productId: string, @GetUser() user: User){
    return this.productService.delete(user, productId);
  }
}
