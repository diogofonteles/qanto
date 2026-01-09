import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { ViaCepService } from './services/viacep.service';
import { GeocodingService } from '../../common/services/geocoding.service';

@Module({
  controllers: [UsersController],
  providers: [UsersService, ViaCepService, GeocodingService],
  exports: [UsersService],
})
export class UsersModule {}
