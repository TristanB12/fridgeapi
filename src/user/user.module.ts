import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { NotificationModule } from 'src/notification/notification.module';
import { ProductModule } from 'src/product/product.module';

@Module({
  providers: [UserService],
  controllers: [UserController],
  imports: [NotificationModule, ProductModule]
})
export class UserModule {}
