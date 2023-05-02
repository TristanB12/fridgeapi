import { Body, Controller, Delete, Get, NotFoundException, Post, UseGuards, UseInterceptors } from '@nestjs/common';
import { UserService } from './user.service';
import { GetUser } from 'src/auth/decorator';
import { User } from '@prisma/client';
import { SentryInterceptor } from 'src/interceptors/sentry.interceptor';
import { JwtGuard } from 'src/auth/guard';
import { NotificationService } from 'src/notification/notification.service';

@UseInterceptors(SentryInterceptor)
@UseGuards(JwtGuard)
@Controller('me')
export class UserController {
  constructor(private userService: UserService, private notificationService: NotificationService) {}

  @Get('dashboard')
  getDashboard(@GetUser() user: User) {
    return this.userService.getDashboard(user);
  }

  @Delete()
  deleteAccount(@GetUser() user: User) {
    return this.userService.deleteUser(user.id);
  }

  @Post('device')
  addDevice(@GetUser() user: User, @Body('notification_token') NotificationToken: string) {
    return this.userService.linkDeviceToUser(user, NotificationToken);
  }

  @Post('test')
  test(@Body('token') token) {
    return this.notificationService.testExpoSdk();
  }
}
