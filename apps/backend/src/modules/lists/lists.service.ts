import {
  Injectable,
  NotFoundException,
  ForbiddenException,
  ConflictException,
} from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';
import { CreateListDto } from './dto/create-list.dto';
import { UpdateListDto } from './dto/update-list.dto';
import { AddItemDto } from './dto/add-item.dto';
import { UpdateItemDto } from './dto/update-item.dto';

@Injectable()
export class ListsService {
  constructor(private prisma: PrismaService) {}

  async create(userId: string, createListDto: CreateListDto) {
    const list = await this.prisma.shoppingList.create({
      data: {
        userId,
        name: createListDto.name,
      },
    });

    return list;
  }

  async findAll(userId: string, status?: string) {
    const where: any = { userId };

    if (status) {
      where.status = status;
    }

    const lists = await this.prisma.shoppingList.findMany({
      where,
      include: {
        items: {
          include: {
            product: {
              select: {
                id: true,
                name: true,
                priceCents: true,
                promoPriceCents: true,
                unit: true,
                quantity: true,
                imageUrl: true,
                supermarket: {
                  select: {
                    id: true,
                    tradingName: true,
                    companyName: true,
                  },
                },
              },
            },
          },
        },
        _count: {
          select: {
            items: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return lists;
  }

  async findOne(userId: string, id: string) {
    const list = await this.prisma.shoppingList.findUnique({
      where: { id },
      include: {
        items: {
          include: {
            product: {
              include: {
                category: {
                  select: {
                    id: true,
                    name: true,
                  },
                },
                supermarket: {
                  select: {
                    id: true,
                    companyName: true,
                    tradingName: true,
                    addressCity: true,
                    addressState: true,
                  },
                },
              },
            },
          },
          orderBy: {
            createdAt: 'asc',
          },
        },
      },
    });

    if (!list) {
      throw new NotFoundException('List not found');
    }

    if (list.userId !== userId) {
      throw new ForbiddenException('You can only access your own lists');
    }

    const total = list.items.reduce((sum, item) => {
      const price = item.product.promoPriceCents || item.product.priceCents;
      return sum + price * item.quantity;
    }, 0);

    return {
      ...list,
      totalCents: total,
      totalItems: list.items.length,
    };
  }

  async update(userId: string, id: string, updateListDto: UpdateListDto) {
    const list = await this.prisma.shoppingList.findUnique({
      where: { id },
    });

    if (!list) {
      throw new NotFoundException('List not found');
    }

    if (list.userId !== userId) {
      throw new ForbiddenException('You can only update your own lists');
    }

    const updated = await this.prisma.shoppingList.update({
      where: { id },
      data: {
        name: updateListDto.name,
        status: updateListDto.status,
      },
    });

    return updated;
  }

  async remove(userId: string, id: string) {
    const list = await this.prisma.shoppingList.findUnique({
      where: { id },
    });

    if (!list) {
      throw new NotFoundException('List not found');
    }

    if (list.userId !== userId) {
      throw new ForbiddenException('You can only delete your own lists');
    }

    await this.prisma.shoppingList.delete({
      where: { id },
    });

    return { message: 'List deleted successfully' };
  }

  async addItem(userId: string, listId: string, addItemDto: AddItemDto) {
    const list = await this.prisma.shoppingList.findUnique({
      where: { id: listId },
    });

    if (!list) {
      throw new NotFoundException('List not found');
    }

    if (list.userId !== userId) {
      throw new ForbiddenException('You can only modify your own lists');
    }

    const product = await this.prisma.product.findUnique({
      where: { id: addItemDto.productId },
    });

    if (!product) {
      throw new NotFoundException('Product not found');
    }

    const existing = await this.prisma.listItem.findUnique({
      where: {
        listId_productId: {
          listId,
          productId: addItemDto.productId,
        },
      },
    });

    if (existing) {
      throw new ConflictException('Product already in list. Use update to change quantity.');
    }

    const item = await this.prisma.listItem.create({
      data: {
        listId,
        productId: addItemDto.productId,
        quantity: addItemDto.quantity,
      },
      include: {
        product: {
          include: {
            supermarket: {
              select: {
                id: true,
                tradingName: true,
                companyName: true,
              },
            },
          },
        },
      },
    });

    return item;
  }

  async updateItem(
    userId: string,
    listId: string,
    itemId: string,
    updateItemDto: UpdateItemDto,
  ) {
    const list = await this.prisma.shoppingList.findUnique({
      where: { id: listId },
    });

    if (!list) {
      throw new NotFoundException('List not found');
    }

    if (list.userId !== userId) {
      throw new ForbiddenException('You can only modify your own lists');
    }

    const item = await this.prisma.listItem.findUnique({
      where: { id: itemId },
    });

    if (!item || item.listId !== listId) {
      throw new NotFoundException('Item not found in this list');
    }

    const updated = await this.prisma.listItem.update({
      where: { id: itemId },
      data: {
        quantity: updateItemDto.quantity,
        isChecked: updateItemDto.isChecked,
      },
      include: {
        product: true,
      },
    });

    return updated;
  }

  async removeItem(userId: string, listId: string, itemId: string) {
    const list = await this.prisma.shoppingList.findUnique({
      where: { id: listId },
    });

    if (!list) {
      throw new NotFoundException('List not found');
    }

    if (list.userId !== userId) {
      throw new ForbiddenException('You can only modify your own lists');
    }

    const item = await this.prisma.listItem.findUnique({
      where: { id: itemId },
    });

    if (!item || item.listId !== listId) {
      throw new NotFoundException('Item not found in this list');
    }

    await this.prisma.listItem.delete({
      where: { id: itemId },
    });

    return { message: 'Item removed from list successfully' };
  }

  async duplicate(userId: string, id: string, name?: string) {
    const originalList = await this.prisma.shoppingList.findUnique({
      where: { id },
      include: {
        items: true,
      },
    });

    if (!originalList) {
      throw new NotFoundException('List not found');
    }

    if (originalList.userId !== userId) {
      throw new ForbiddenException('You can only duplicate your own lists');
    }

    const newList = await this.prisma.shoppingList.create({
      data: {
        userId,
        name: name || `${originalList.name} (Copy)`,
        items: {
          create: originalList.items.map((item) => ({
            productId: item.productId,
            quantity: item.quantity,
          })),
        },
      },
      include: {
        items: {
          include: {
            product: true,
          },
        },
      },
    });

    return newList;
  }
}
