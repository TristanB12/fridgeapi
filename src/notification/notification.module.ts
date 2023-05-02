import { Module } from '@nestjs/common';
import { NotificationService } from './notification.service';
import { ProductModule } from 'src/product/product.module';

@Module({
  providers: [NotificationService],
  exports: [NotificationService],
  imports: [ProductModule]
})
export class NotificationModule {}
