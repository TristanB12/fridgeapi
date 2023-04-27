import { Module } from '@nestjs/common';
import { ListsService } from './lists.service';
import { ListsController } from './lists.controller';
import { ProductModule } from 'src/product/product.module';

@Module({
  controllers: [ListsController],
  providers: [ListsService],
  imports: [ProductModule]
})
export class ListsModule {}
