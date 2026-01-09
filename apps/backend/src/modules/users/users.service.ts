import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { UpdateAddressDto } from './dto/update-address.dto';
import { ViaCepService } from './services/viacep.service';

@Injectable()
export class UsersService {
  constructor(
    private prisma: PrismaService,
    private viaCepService: ViaCepService,
  ) {}

  async findOne(id: string) {
    const user = await this.prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        status: true,
        phone: true,
        birthDate: true,
        addressStreet: true,
        addressNumber: true,
        addressComplement: true,
        addressNeighborhood: true,
        addressCity: true,
        addressState: true,
        addressZipcode: true,
        addressLat: true,
        addressLng: true,
        searchRadiusKm: true,
        planId: true,
        plan: {
          select: {
            id: true,
            name: true,
            type: true,
            compareLimit: true,
            alertLimit: true,
          },
        },
        emailVerifiedAt: true,
        createdAt: true,
      },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return user;
  }

  async updateProfile(userId: string, updateProfileDto: UpdateProfileDto) {
    const user = await this.prisma.user.update({
      where: { id: userId },
      data: {
        name: updateProfileDto.name,
        phone: updateProfileDto.phone,
        birthDate: updateProfileDto.birthDate
          ? new Date(updateProfileDto.birthDate)
          : undefined,
      },
      select: {
        id: true,
        email: true,
        name: true,
        phone: true,
        birthDate: true,
      },
    });

    return user;
  }

  async updateAddress(userId: string, updateAddressDto: UpdateAddressDto) {
    const viaCepData = await this.viaCepService.getAddressByCep(
      updateAddressDto.addressZipcode,
    );

    if (
      viaCepData.logradouro &&
      viaCepData.logradouro !== updateAddressDto.addressStreet
    ) {
      console.warn(
        `Street mismatch: ViaCEP returned ${viaCepData.logradouro} but user provided ${updateAddressDto.addressStreet}`,
      );
    }

    const user = await this.prisma.user.update({
      where: { id: userId },
      data: {
        addressZipcode: updateAddressDto.addressZipcode.replace(/\D/g, ''),
        addressStreet: updateAddressDto.addressStreet,
        addressNumber: updateAddressDto.addressNumber,
        addressComplement: updateAddressDto.addressComplement,
        addressNeighborhood: updateAddressDto.addressNeighborhood,
        addressCity: updateAddressDto.addressCity,
        addressState: updateAddressDto.addressState,
        addressLat: updateAddressDto.addressLat,
        addressLng: updateAddressDto.addressLng,
        searchRadiusKm: updateAddressDto.searchRadiusKm,
      },
      select: {
        id: true,
        addressStreet: true,
        addressNumber: true,
        addressComplement: true,
        addressNeighborhood: true,
        addressCity: true,
        addressState: true,
        addressZipcode: true,
        addressLat: true,
        addressLng: true,
        searchRadiusKm: true,
      },
    });

    return user;
  }

  async deleteAccount(userId: string) {
    await this.prisma.user.update({
      where: { id: userId },
      data: { status: 'inactive' },
    });

    return { message: 'Account deactivated successfully' };
  }
}
