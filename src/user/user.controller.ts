import { Controller, Delete, UseGuards, UseInterceptors } from '@nestjs/common';
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
}
