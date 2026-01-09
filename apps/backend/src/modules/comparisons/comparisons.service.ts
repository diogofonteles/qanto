import {
  Injectable,
  NotFoundException,
  ForbiddenException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';
import { CreateComparisonDto } from './dto/create-comparison.dto';

interface ProductComparison {
  productId: string;
  name: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  available: boolean;
  originalProduct?: any;
}

interface SupermarketComparison {
  supermarketId: string;
  supermarketName: string;
  tradingName?: string;
  distance?: number;
  items: ProductComparison[];
  subtotal: number;
  unavailableCount: number;
  availableCount: number;
}

@Injectable()
export class ComparisonsService {
  constructor(private prisma: PrismaService) {}

  async create(userId: string, createComparisonDto: CreateComparisonDto) {
    const list = await this.prisma.shoppingList.findUnique({
      where: { id: createComparisonDto.listId },
      include: {
        items: {
          include: {
            product: true,
          },
        },
        user: {
          select: {
            plan: {
              select: {
                compareLimit: true,
              },
            },
            addressLat: true,
            addressLng: true,
          },
        },
      },
    });

    if (!list) {
      throw new NotFoundException('Shopping list not found');
    }

    if (list.userId !== userId) {
      throw new ForbiddenException('You can only compare your own lists');
    }

    if (list.items.length === 0) {
      throw new BadRequestException('Cannot compare an empty list');
    }

    const compareLimit = list.user.plan?.compareLimit;
    if (compareLimit && createComparisonDto.supermarketIds.length > compareLimit) {
      throw new BadRequestException(
        `Your plan allows comparing up to ${compareLimit} supermarkets`,
      );
    }

    const supermarkets = await this.prisma.supermarket.findMany({
      where: {
        id: { in: createComparisonDto.supermarketIds },
      },
    });

    if (supermarkets.length !== createComparisonDto.supermarketIds.length) {
      throw new BadRequestException('One or more supermarkets not found');
    }

    const results: SupermarketComparison[] = [];

    for (const supermarket of supermarkets) {
      const items: ProductComparison[] = [];
      let subtotal = 0;
      let unavailableCount = 0;
      let availableCount = 0;

      for (const listItem of list.items) {
        const originalProduct = listItem.product;

        const supermarketProduct = await this.prisma.product.findFirst({
          where: {
            supermarketId: supermarket.id,
            status: 'active',
            OR: [
              { barcode: originalProduct.barcode },
              {
                AND: [
                  { name: { contains: originalProduct.name.split(' ')[0], mode: 'insensitive' } },
                  { categoryId: originalProduct.categoryId },
                ],
              },
            ],
          },
          orderBy: [
            { barcode: originalProduct.barcode ? 'asc' : 'desc' },
            { priceCents: 'asc' },
          ],
        });

        if (supermarketProduct) {
          const effectivePrice =
            supermarketProduct.promoPriceCents || supermarketProduct.priceCents;
          const totalPrice = effectivePrice * listItem.quantity;

          items.push({
            productId: supermarketProduct.id,
            name: supermarketProduct.name,
            quantity: listItem.quantity,
            unitPrice: effectivePrice,
            totalPrice,
            available: true,
            originalProduct: supermarketProduct,
          });

          subtotal += totalPrice;
          availableCount++;
        } else {
          items.push({
            productId: originalProduct.id,
            name: originalProduct.name,
            quantity: listItem.quantity,
            unitPrice: 0,
            totalPrice: 0,
            available: false,
          });

          unavailableCount++;
        }
      }

      let distance: number | undefined;
      if (list.user.addressLat && list.user.addressLng) {
        distance = this.calculateDistance(
          Number(list.user.addressLat),
          Number(list.user.addressLng),
          Number(supermarket.addressLat),
          Number(supermarket.addressLng),
        );
      }

      results.push({
        supermarketId: supermarket.id,
        supermarketName: supermarket.companyName,
        tradingName: supermarket.tradingName || undefined,
        distance,
        items,
        subtotal,
        unavailableCount,
        availableCount,
      });
    }

    results.sort((a, b) => a.subtotal - b.subtotal);

    const cheapest = results[0];
    const secondCheapest = results[1];
    const savings = secondCheapest ? secondCheapest.subtotal - cheapest.subtotal : 0;

    const comparison = await this.prisma.comparison.create({
      data: {
        userId,
        listId: createComparisonDto.listId,
        supermarketIds: createComparisonDto.supermarketIds,
        results: results as any,
        cheapestSupermarketId: cheapest.supermarketId,
        cheapestTotalCents: cheapest.subtotal,
      },
    });

    return {
      id: comparison.id,
      listId: createComparisonDto.listId,
      results,
      cheapest: {
        supermarketId: cheapest.supermarketId,
        supermarketName: cheapest.supermarketName,
        total: cheapest.subtotal,
        savings,
        savingsPercentage:
          secondCheapest && secondCheapest.subtotal > 0
            ? ((savings / secondCheapest.subtotal) * 100).toFixed(2)
            : '0',
      },
      createdAt: comparison.createdAt,
    };
  }

  async findAll(userId: string, limit: number = 10) {
    const comparisons = await this.prisma.comparison.findMany({
      where: { userId },
      include: {
        list: {
          select: {
            id: true,
            name: true,
          },
        },
        cheapestSupermarket: {
          select: {
            id: true,
            companyName: true,
            tradingName: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
      take: limit,
    });

    return comparisons;
  }

  async findOne(userId: string, id: string) {
    const comparison = await this.prisma.comparison.findUnique({
      where: { id },
      include: {
        list: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });

    if (!comparison) {
      throw new NotFoundException('Comparison not found');
    }

    if (comparison.userId !== userId) {
      throw new ForbiddenException('You can only view your own comparisons');
    }

    return comparison;
  }

  private calculateDistance(
    lat1: number,
    lng1: number,
    lat2: number,
    lng2: number,
  ): number {
    const R = 6371;
    const dLat = this.toRad(lat2 - lat1);
    const dLng = this.toRad(lng2 - lng1);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(this.toRad(lat1)) *
        Math.cos(this.toRad(lat2)) *
        Math.sin(dLng / 2) *
        Math.sin(dLng / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return Math.round(R * c * 100) / 100;
  }

  private toRad(degrees: number): number {
    return degrees * (Math.PI / 180);
  }
}
