import { Injectable } from '@nestjs/common';
import { User } from '@prisma/client';
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
      throw error;
    }
  }
}
