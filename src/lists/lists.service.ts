import { Injectable } from '@nestjs/common';
import { CreateListDto } from './dto/create-list.dto';
import { UpdateListDto } from './dto/update-list.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { ProductStatus, User } from '@prisma/client';
import { ProductService } from 'src/product/product.service';

@Injectable()
export class ListsService {
  constructor(private prisma: PrismaService, private productService: ProductService) {}

  async create(user: User, createListDto: CreateListDto) {
    try {
      const lists = await this.prisma.list.create({
        data: {
          ...createListDto,
          user: {
            connect: { id: user.id }
          }
        }
      })
    } catch (error) {
      throw error;
    }
  }

  async findAll(user: User, status: ProductStatus) {
    try {
      const lists = await this.prisma.list.findMany({
        where: { user_id: user.id },
        include: {
          products: {
            where: {status }
          }
        }
      })
      return this.serializedList(lists);
    } catch (error) {
      throw error;
    }
  }

  async findOne(id: number) {
    try {
      const list =  await this.prisma.list.findUnique({
        where: { id },
        include: {
          products: true
        }
      })
      return this.serializedList(list);
    } catch (error) {
      throw error;
    }
  }

  update(id: number, updateListDto: UpdateListDto) {
    return `This action updates a #${id} list`;
  }

  async remove(id: number) {
    try {
      await this.prisma.list.delete({
        where: { id }
      })
      return 'list deleted successfully.'
    } catch (error) {
      throw error;
    };
  }

  serializedList(data) {
    const serialize = list => ({
      id: list.id,
      name: list.name,
      products: this.productService.serializedProduct(list.products)
    });

    if (Array.isArray(data)) {
      return data.map(e => serialize(e));
    }
    return serialize(data);
  }
}
