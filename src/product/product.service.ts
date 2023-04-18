import { BadRequestException, Injectable, UnauthorizedException } from '@nestjs/common';
import { ProductStatus, User } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateProductDto, UpdateProductDto } from './dto';

@Injectable()
export class ProductService {
  constructor(private prisma: PrismaService) {}

  async findManyByUser(user: User, status: ProductStatus) {
    try {
      return await this.prisma.product.findMany({
        where: { user_id: user.id, status }
      })
    } catch (error) {
      throw error;
    }
  }

  async createForUser(user: User, dto: CreateProductDto) {
    if (!this.isDateValid(dto.expiry_date)) throw new BadRequestException('Invalid date.');

    try {
      return await this.prisma.product.create({
        data: {
          name: dto.name,
          expiry_date: new Date(dto.expiry_date),
          quantity: dto.quantity,
          quantity_type: dto.quantity_type,
          user_id: user.id,
        },
      })
    } catch (error) {
      throw error;
    }
  }

  async updateOne(user: User, dto: UpdateProductDto, productId: number) {
    if (dto.expiry_date && !this.isDateValid(dto.expiry_date))
      throw new BadRequestException('Invalid date.');

    try {
      const count = await this.prisma.product.count({
        where: {
          id: productId,
          user_id: user.id
        }
      });
      if (count != 1) throw new UnauthorizedException('User does not have access to this product.');

      return await this.prisma.product.update({
        where: { id: productId },
        data: {
          ...dto
        }
      })
    } catch (error) {
      throw error;  
    }
  }

  async delete(user: User, productId: number) {
    try {
      const count = await this.prisma.product.count({
        where: {
          id: productId,
          user_id: user.id
        }
      });
      if (count != 1) throw new UnauthorizedException('User does not have access to this product.');

      await this.prisma.product.delete({where: { id: productId }});
      return 'record deleted.';
    } catch (error) {
      throw error;
    }
  }

  private isDateValid(date: Date) {
    const expiryDate = new Date(date);

    console.log(expiryDate.getTime())
    if (!expiryDate.getTime()) return false;
    return true;
  }
}
