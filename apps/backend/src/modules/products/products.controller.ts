import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { FilterProductsDto } from './dto/filter-products.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { UserRole } from '@prisma/client';

@ApiTags('Products')
@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.supermarket)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create a new product (supermarket only)' })
  create(@CurrentUser() user: any, @Body() createProductDto: CreateProductDto) {
    return this.productsService.create(user.id, createProductDto);
  }

  @Get()
  @ApiOperation({ summary: 'List all products with filters' })
  findAll(@Query() filterDto: FilterProductsDto) {
    return this.productsService.findAll(filterDto);
  }

  @Get('categories')
  @ApiOperation({ summary: 'Get all categories with subcategories' })
  getCategories() {
    return this.productsService.getCategories();
  }

  @Get('my-products')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.supermarket)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get products of logged supermarket' })
  findBySupermarket(@CurrentUser() user: any, @Query() filterDto: FilterProductsDto) {
    return this.productsService.findBySupermarket(user.id, filterDto);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get product by ID' })
  findOne(@Param('id') id: string) {
    return this.productsService.findOne(id);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.supermarket)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update a product (supermarket only)' })
  update(
    @CurrentUser() user: any,
    @Param('id') id: string,
    @Body() updateProductDto: UpdateProductDto,
  ) {
    return this.productsService.update(user.id, id, updateProductDto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.supermarket)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete a product (supermarket only)' })
  remove(@CurrentUser() user: any, @Param('id') id: string) {
    return this.productsService.remove(user.id, id);
  }
}
