import { Injectable } from '@nestjs/common';
import { User } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { ProductEntity } from 'src/product/entities/product.entity';
import { ProductService } from 'src/product/product.service';

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService, private productService: ProductService) {}

  async deleteUser(userId: number) {
    try {
      await this.prisma.user.delete({where: {
        id: userId
      }})
      return 'User deleted successfully.'
    } catch (error) {
      throw error;
    }
  }

  async linkDeviceToUser(user: User, NotificationToken: string) {
    try {
      await this.prisma.user.update({
        where: { id: user.id },
        data: {
          devices: {
            create: {
              notification_token: NotificationToken
            }
          }
        }
      })
      return 'device added';
    } catch (error) {
      if (error.code == 'P2002') {
        return 'device already registered.';
      }
      throw error;
    }
  }

  async getDashboard(user: User) {
    try {
      const products = await this.productService.findManyByUser(user, undefined) as ProductEntity[];

      console.log(products)
      return {
        red: products.filter(e => e.expires_in <= 0),
        orange: products.filter(e => e.expires_in > 0 && e.expires_in <= 3),
        yellow: products.filter(e => e.expires_in > 3 && e.expires_in <= 7)
      }
    } catch (error) {
      throw error;
    }
  }
}
