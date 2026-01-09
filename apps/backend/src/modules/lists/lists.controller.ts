import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Query,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { ListsService } from './lists.service';
import { CreateListDto } from './dto/create-list.dto';
import { UpdateListDto } from './dto/update-list.dto';
import { AddItemDto } from './dto/add-item.dto';
import { UpdateItemDto } from './dto/update-item.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { UserRole } from '@prisma/client';

@ApiTags('Shopping Lists')
@Controller('lists')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(UserRole.consumer)
@ApiBearerAuth()
export class ListsController {
  constructor(private readonly listsService: ListsService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new shopping list' })
  create(@CurrentUser() user: any, @Body() createListDto: CreateListDto) {
    return this.listsService.create(user.id, createListDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all shopping lists' })
  findAll(@CurrentUser() user: any, @Query('status') status?: string) {
    return this.listsService.findAll(user.id, status);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a shopping list by ID' })
  findOne(@CurrentUser() user: any, @Param('id') id: string) {
    return this.listsService.findOne(user.id, id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a shopping list' })
  update(
    @CurrentUser() user: any,
    @Param('id') id: string,
    @Body() updateListDto: UpdateListDto,
  ) {
    return this.listsService.update(user.id, id, updateListDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a shopping list' })
  remove(@CurrentUser() user: any, @Param('id') id: string) {
    return this.listsService.remove(user.id, id);
  }

  @Post(':id/duplicate')
  @ApiOperation({ summary: 'Duplicate a shopping list' })
  duplicate(
    @CurrentUser() user: any,
    @Param('id') id: string,
    @Body('name') name?: string,
  ) {
    return this.listsService.duplicate(user.id, id, name);
  }

  @Post(':id/items')
  @ApiOperation({ summary: 'Add item to shopping list' })
  addItem(
    @CurrentUser() user: any,
    @Param('id') listId: string,
    @Body() addItemDto: AddItemDto,
  ) {
    return this.listsService.addItem(user.id, listId, addItemDto);
  }

  @Patch(':listId/items/:itemId')
  @ApiOperation({ summary: 'Update item in shopping list' })
  updateItem(
    @CurrentUser() user: any,
    @Param('listId') listId: string,
    @Param('itemId') itemId: string,
    @Body() updateItemDto: UpdateItemDto,
  ) {
    return this.listsService.updateItem(user.id, listId, itemId, updateItemDto);
  }

  @Delete(':listId/items/:itemId')
  @ApiOperation({ summary: 'Remove item from shopping list' })
  removeItem(
    @CurrentUser() user: any,
    @Param('listId') listId: string,
    @Param('itemId') itemId: string,
  ) {
    return this.listsService.removeItem(user.id, listId, itemId);
  }
}
