import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Query, UseInterceptors, ClassSerializerInterceptor } from '@nestjs/common';
import { ListsService } from './lists.service';
import { CreateListDto } from './dto/create-list.dto';
import { UpdateListDto } from './dto/update-list.dto';
import { JwtGuard } from 'src/auth/guard';
import { GetUser } from 'src/auth/decorator';
import { User } from '@prisma/client';
import { FilterQueriesDto } from 'src/product/dto';

@UseGuards(JwtGuard)
@Controller('lists')
@UseInterceptors(ClassSerializerInterceptor)
export class ListsController {
  constructor(private readonly listsService: ListsService) {}

  @Post()
  create(@GetUser() user: User, @Body() createListDto: CreateListDto) {
    return this.listsService.create(user, createListDto);
  }

  @Get()
  async findAll(@GetUser() user: User, @Query() queries: FilterQueriesDto) {
    return await this.listsService.findAll(user, queries.status);
  }

  @Get(':id')
  findOne(@GetUser() user: User, @Param('id') id: string, @Query() queries: FilterQueriesDto) {
    return this.listsService.findOne(+id, queries.status);
  }

  @Patch(':id')
  update(@GetUser() user: User, @Param('id') id: string, @Body() updateListDto: UpdateListDto) {
    return this.listsService.update(+id, updateListDto);
  }

  @Delete(':id')
  remove(@GetUser() user: User, @Param('id') id: string) {
    return this.listsService.remove(+id);
  }
}
