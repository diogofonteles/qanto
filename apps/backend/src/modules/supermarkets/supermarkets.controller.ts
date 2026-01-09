import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { SupermarketsService } from './supermarkets.service';
import { CreateSupermarketDto } from './dto/create-supermarket.dto';
import { UpdateSupermarketDto } from './dto/update-supermarket.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { UserRole } from '@prisma/client';

@ApiTags('Supermarkets')
@Controller('supermarkets')
export class SupermarketsController {
  constructor(private readonly supermarketsService: SupermarketsService) {}

  @Post('register')
  @ApiOperation({ summary: 'Register a new supermarket' })
  async register(@Body() createSupermarketDto: CreateSupermarketDto) {
    return this.supermarketsService.create(createSupermarketDto);
  }

  @Get()
  @ApiOperation({ summary: 'List supermarkets with optional filters' })
  @ApiQuery({ name: 'city', required: false })
  @ApiQuery({ name: 'latitude', required: false, type: Number })
  @ApiQuery({ name: 'longitude', required: false, type: Number })
  @ApiQuery({ name: 'radiusKm', required: false, type: Number })
  async findAll(
    @Query('city') city?: string,
    @Query('latitude') latitude?: string,
    @Query('longitude') longitude?: string,
    @Query('radiusKm') radiusKm?: string,
  ) {
    return this.supermarketsService.findAll(
      city,
      latitude ? parseFloat(latitude) : undefined,
      longitude ? parseFloat(longitude) : undefined,
      radiusKm ? parseFloat(radiusKm) : undefined,
    );
  }

  @Get('profile')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.supermarket)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get supermarket profile' })
  async getProfile(@CurrentUser() user: any) {
    return this.supermarketsService.findByUserId(user.id);
  }

  @Patch('profile')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.supermarket)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update supermarket profile' })
  async updateProfile(
    @CurrentUser() user: any,
    @Body() updateSupermarketDto: UpdateSupermarketDto,
  ) {
    return this.supermarketsService.update(user.id, updateSupermarketDto);
  }
}
