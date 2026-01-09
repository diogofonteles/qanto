import {
  Injectable,
  ConflictException,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { PrismaService } from '../../database/prisma.service';
import { CreateSupermarketDto } from './dto/create-supermarket.dto';
import { UpdateSupermarketDto } from './dto/update-supermarket.dto';
import { CNPJValidator } from '../../common/validators/cnpj.validator';
import { GeocodingService } from '../../common/services/geocoding.service';

@Injectable()
export class SupermarketsService {
  constructor(
    private prisma: PrismaService,
    private geocodingService: GeocodingService,
  ) {}

  async create(createSupermarketDto: CreateSupermarketDto) {
    const existingEmail = await this.prisma.user.findUnique({
      where: { email: createSupermarketDto.email },
    });

    if (existingEmail) {
      throw new ConflictException('Email already exists');
    }

    const cleanCNPJ = CNPJValidator.clean(createSupermarketDto.cnpj);

    const existingCNPJ = await this.prisma.supermarket.findUnique({
      where: { cnpj: cleanCNPJ },
    });

    if (existingCNPJ) {
      throw new ConflictException('CNPJ already registered');
    }

    const hashedPassword = await bcrypt.hash(createSupermarketDto.password, 10);

    // Calculate coordinates if not provided
    let addressLat = createSupermarketDto.addressLat;
    let addressLng = createSupermarketDto.addressLng;

    if (!addressLat || !addressLng) {
      const geocodingResult = await this.geocodingService.geocodeAddress(
        createSupermarketDto.addressStreet,
        createSupermarketDto.addressNumber,
        createSupermarketDto.addressNeighborhood,
        createSupermarketDto.addressCity,
        createSupermarketDto.addressState,
        createSupermarketDto.addressZipcode,
      );

      addressLat = geocodingResult.latitude;
      addressLng = geocodingResult.longitude;
    }

    const result = await this.prisma.$transaction(async (tx) => {
      const user = await tx.user.create({
        data: {
          email: createSupermarketDto.email,
          name: createSupermarketDto.companyName,
          passwordHash: hashedPassword,
          role: 'supermarket',
        },
      });

      const supermarket = await tx.supermarket.create({
        data: {
          userId: user.id,
          companyName: createSupermarketDto.companyName,
          tradingName: createSupermarketDto.tradingName,
          cnpj: cleanCNPJ,
          phone: createSupermarketDto.phone,
          website: createSupermarketDto.website,
          addressStreet: createSupermarketDto.addressStreet,
          addressNumber: createSupermarketDto.addressNumber,
          addressComplement: createSupermarketDto.addressComplement,
          addressNeighborhood: createSupermarketDto.addressNeighborhood,
          addressCity: createSupermarketDto.addressCity,
          addressState: createSupermarketDto.addressState,
          addressZipcode: createSupermarketDto.addressZipcode.replace(/\D/g, ''),
          addressLat: addressLat,
          addressLng: addressLng,
          logoUrl: createSupermarketDto.logoUrl,
          description: createSupermarketDto.description,
          openingHours: createSupermarketDto.openingHours,
        },
        include: {
          user: {
            select: {
              id: true,
              email: true,
              role: true,
              status: true,
            },
          },
        },
      });

      return supermarket;
    });

    return result;
  }

  async findByUserId(userId: string) {
    const supermarket = await this.prisma.supermarket.findUnique({
      where: { userId },
      include: {
        user: {
          select: {
            id: true,
            email: true,
            status: true,
          },
        },
        plan: {
          select: {
            id: true,
            name: true,
            type: true,
            featuredLimit: true,
            features: true,
          },
        },
      },
    });

    if (!supermarket) {
      throw new NotFoundException('Supermarket not found');
    }

    return supermarket;
  }

  async findAll(city?: string, latitude?: number, longitude?: number, radiusKm?: number) {
    const where: any = {};

    if (city) {
      where.addressCity = {
        contains: city,
        mode: 'insensitive',
      };
    }

    const supermarkets = await this.prisma.supermarket.findMany({
      where,
      select: {
        id: true,
        companyName: true,
        tradingName: true,
        addressStreet: true,
        addressNumber: true,
        addressNeighborhood: true,
        addressCity: true,
        addressState: true,
        addressZipcode: true,
        addressLat: true,
        addressLng: true,
        logoUrl: true,
        description: true,
        rankingScore: true,
        isVerified: true,
      },
      orderBy: {
        rankingScore: 'desc',
      },
    });

    if (latitude && longitude && radiusKm) {
      return supermarkets.filter((s) => {
        const distance = this.calculateDistance(
          latitude,
          longitude,
          Number(s.addressLat),
          Number(s.addressLng),
        );
        return distance <= radiusKm;
      });
    }

    return supermarkets;
  }

  async update(userId: string, updateSupermarketDto: UpdateSupermarketDto) {
    const existing = await this.prisma.supermarket.findUnique({
      where: { userId },
    });

    if (!existing) {
      throw new NotFoundException('Supermarket not found');
    }

    const supermarket = await this.prisma.supermarket.update({
      where: { userId },
      data: {
        tradingName: updateSupermarketDto.tradingName,
        phone: updateSupermarketDto.phone,
        website: updateSupermarketDto.website,
        logoUrl: updateSupermarketDto.logoUrl,
        description: updateSupermarketDto.description,
        openingHours: updateSupermarketDto.openingHours,
      },
    });

    return supermarket;
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
    return R * c;
  }

  private toRad(degrees: number): number {
    return degrees * (Math.PI / 180);
  }
}
