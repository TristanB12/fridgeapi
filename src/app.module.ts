import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { ProductModule } from './product/product.module';
import { UserModule } from './user/user.module';
import { NotificationService } from './notification/notification.service';
import { NotificationModule } from './notification/notification.module';
import { ListsModule } from './lists/lists.module';
import { ScheduleModule } from '@nestjs/schedule';

@Module({
  imports: [
    ScheduleModule.forRoot(),
    ConfigModule.forRoot({ isGlobal: true }),
    PrismaModule,
    AuthModule,
    ProductModule,
    UserModule,
    NotificationModule,
    ListsModule
  ],
  controllers: [],
  providers: [NotificationService],
})
export class AppModule {}
