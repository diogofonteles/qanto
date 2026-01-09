import { Controller, Get, Post, Body, Param, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { ComparisonsService } from './comparisons.service';
import { CreateComparisonDto } from './dto/create-comparison.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { UserRole } from '@prisma/client';

@ApiTags('Comparisons')
@Controller('comparisons')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(UserRole.consumer)
@ApiBearerAuth()
export class ComparisonsController {
  constructor(private readonly comparisonsService: ComparisonsService) {}

  @Post()
  @ApiOperation({ summary: 'Compare prices across supermarkets' })
  create(@CurrentUser() user: any, @Body() createComparisonDto: CreateComparisonDto) {
    return this.comparisonsService.create(user.id, createComparisonDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get comparison history' })
  findAll(@CurrentUser() user: any, @Query('limit') limit?: number) {
    return this.comparisonsService.findAll(user.id, limit);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a comparison by ID' })
  findOne(@CurrentUser() user: any, @Param('id') id: string) {
    return this.comparisonsService.findOne(user.id, id);
  }
}
