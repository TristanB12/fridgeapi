import { Body, Controller, Delete, NotFoundException, Post, UseGuards, UseInterceptors } from '@nestjs/common';
import { UserService } from './user.service';
import { GetUser } from 'src/auth/decorator';
import { User } from '@prisma/client';
import { SentryInterceptor } from 'src/interceptors/sentry.interceptor';
import { JwtGuard } from 'src/auth/guard';

@UseInterceptors(SentryInterceptor)
@UseGuards(JwtGuard)
@Controller('me')
export class UserController {
  constructor(private userService: UserService) {}

  @Delete()
  deleteAccount(@GetUser() user: User) {
    return this.userService.deleteUser(user.id);
  }

  @Post('device')
  addDevice(@GetUser() user: User, @Body('notification_token') NotificationToken: string) {
    return this.userService.linkDeviceToUser(user, NotificationToken);
  }
}
