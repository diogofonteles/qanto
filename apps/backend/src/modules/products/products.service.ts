import {
  Injectable,
  NotFoundException,
  ForbiddenException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { FilterProductsDto } from './dto/filter-products.dto';

@Injectable()
export class ProductsService {
  constructor(private prisma: PrismaService) {}

  async create(userId: string, createProductDto: CreateProductDto) {
    const supermarket = await this.prisma.supermarket.findUnique({
      where: { userId },
    });

    if (!supermarket) {
      throw new ForbiddenException('User is not a supermarket');
    }

    const category = await this.prisma.category.findUnique({
      where: { id: createProductDto.categoryId },
    });

    if (!category) {
      throw new BadRequestException('Category not found');
    }

    const product = await this.prisma.product.create({
      data: {
        supermarketId: supermarket.id,
        name: createProductDto.name,
        description: createProductDto.description,
        barcode: createProductDto.barcode,
        sku: createProductDto.sku,
        brand: createProductDto.brand,
        unit: createProductDto.unit,
        quantity: createProductDto.quantity,
        priceCents: createProductDto.priceCents,
        promoPriceCents: createProductDto.promoPriceCents,
        promoStartDate: createProductDto.promoStartDate
          ? new Date(createProductDto.promoStartDate)
          : null,
        promoEndDate: createProductDto.promoEndDate
          ? new Date(createProductDto.promoEndDate)
          : null,
        imageUrl: createProductDto.imageUrl,
        categoryId: createProductDto.categoryId,
      },
      include: {
        category: true,
        supermarket: {
          select: {
            id: true,
            companyName: true,
            tradingName: true,
          },
        },
      },
    });

    return product;
  }

  async findAll(filterDto: FilterProductsDto) {
    const { page = 1, limit = 20, sortBy = 'relevance', sortOrder = 'asc' } = filterDto;
    const skip = (page - 1) * limit;

    const where: any = {
      status: 'active',
    };

    if (filterDto.search) {
      where.OR = [
        { name: { contains: filterDto.search, mode: 'insensitive' } },
        { description: { contains: filterDto.search, mode: 'insensitive' } },
        { brand: { contains: filterDto.search, mode: 'insensitive' } },
        { barcode: { contains: filterDto.search } },
      ];
    }

    if (filterDto.categoryId) {
      where.categoryId = filterDto.categoryId;
    }

    if (filterDto.supermarketId) {
      where.supermarketId = filterDto.supermarketId;
    }

    if (filterDto.minPrice !== undefined) {
      where.priceCents = { ...where.priceCents, gte: filterDto.minPrice };
    }

    if (filterDto.maxPrice !== undefined) {
      where.priceCents = { ...where.priceCents, lte: filterDto.maxPrice };
    }

    if (filterDto.onPromotion) {
      where.AND = [
        { promoPriceCents: { not: null } },
        {
          OR: [
            { promoStartDate: null },
            { promoStartDate: { lte: new Date() } },
          ],
        },
        {
          OR: [
            { promoEndDate: null },
            { promoEndDate: { gte: new Date() } },
          ],
        },
      ];
    }

    if (filterDto.featured) {
      where.isFeatured = true;
      where.OR = [
        { featuredUntil: null },
        { featuredUntil: { gte: new Date() } },
      ];
    }

    let orderBy: any = {};
    if (sortBy === 'name') {
      orderBy.name = sortOrder;
    } else if (sortBy === 'price') {
      orderBy.priceCents = sortOrder;
    } else {
      orderBy.createdAt = 'desc';
    }

    const [products, total] = await Promise.all([
      this.prisma.product.findMany({
        where,
        skip,
        take: limit,
        orderBy,
        include: {
          category: {
            select: {
              id: true,
              name: true,
              slug: true,
            },
          },
          supermarket: {
            select: {
              id: true,
              companyName: true,
              tradingName: true,
              addressCity: true,
              addressState: true,
              logoUrl: true,
            },
          },
        },
      }),
      this.prisma.product.count({ where }),
    ]);

    return {
      data: products,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async findOne(id: string) {
    const product = await this.prisma.product.findUnique({
      where: { id },
      include: {
        category: {
          select: {
            id: true,
            name: true,
            slug: true,
            parent: {
              select: {
                id: true,
                name: true,
                slug: true,
              },
            },
          },
        },
        supermarket: {
          select: {
            id: true,
            companyName: true,
            tradingName: true,
            addressStreet: true,
            addressNumber: true,
            addressNeighborhood: true,
            addressCity: true,
            addressState: true,
            addressLat: true,
            addressLng: true,
            logoUrl: true,
            phone: true,
            website: true,
          },
        },
        priceHistory: {
          take: 30,
          orderBy: { recordedAt: 'desc' },
        },
      },
    });

    if (!product) {
      throw new NotFoundException('Product not found');
    }

    return product;
  }

  async findBySupermarket(userId: string, filterDto: FilterProductsDto) {
    const supermarket = await this.prisma.supermarket.findUnique({
      where: { userId },
    });

    if (!supermarket) {
      throw new ForbiddenException('User is not a supermarket');
    }

    return this.findAll({ ...filterDto, supermarketId: supermarket.id });
  }

  async update(userId: string, id: string, updateProductDto: UpdateProductDto) {
    const supermarket = await this.prisma.supermarket.findUnique({
      where: { userId },
    });

    if (!supermarket) {
      throw new ForbiddenException('User is not a supermarket');
    }

    const product = await this.prisma.product.findUnique({
      where: { id },
    });

    if (!product) {
      throw new NotFoundException('Product not found');
    }

    if (product.supermarketId !== supermarket.id) {
      throw new ForbiddenException('You can only update your own products');
    }

    const updated = await this.prisma.product.update({
      where: { id },
      data: {
        name: updateProductDto.name,
        description: updateProductDto.description,
        brand: updateProductDto.brand,
        unit: updateProductDto.unit,
        quantity: updateProductDto.quantity,
        priceCents: updateProductDto.priceCents,
        promoPriceCents: updateProductDto.promoPriceCents,
        promoStartDate: updateProductDto.promoStartDate
          ? new Date(updateProductDto.promoStartDate)
          : undefined,
        promoEndDate: updateProductDto.promoEndDate
          ? new Date(updateProductDto.promoEndDate)
          : undefined,
        imageUrl: updateProductDto.imageUrl,
        categoryId: updateProductDto.categoryId,
        status: updateProductDto.status,
        isFeatured: updateProductDto.isFeatured,
      },
      include: {
        category: true,
        supermarket: {
          select: {
            id: true,
            companyName: true,
            tradingName: true,
          },
        },
      },
    });

    return updated;
  }

  async remove(userId: string, id: string) {
    const supermarket = await this.prisma.supermarket.findUnique({
      where: { userId },
    });

    if (!supermarket) {
      throw new ForbiddenException('User is not a supermarket');
    }

    const product = await this.prisma.product.findUnique({
      where: { id },
    });

    if (!product) {
      throw new NotFoundException('Product not found');
    }

    if (product.supermarketId !== supermarket.id) {
      throw new ForbiddenException('You can only delete your own products');
    }

    await this.prisma.product.update({
      where: { id },
      data: { status: 'inactive' },
    });

    return { message: 'Product deleted successfully' };
  }

  async getCategories() {
    const categories = await this.prisma.category.findMany({
      where: {
        isActive: true,
        parentId: null,
      },
      include: {
        children: {
          where: { isActive: true },
          orderBy: { sortOrder: 'asc' },
        },
      },
      orderBy: { sortOrder: 'asc' },
    });

    return categories;
  }
}
