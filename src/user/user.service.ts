import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}

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
}
