import { Module } from '@nestjs/common';
import { SupermarketsService } from './supermarkets.service';
import { SupermarketsController } from './supermarkets.controller';
import { GeocodingService } from '../../common/services/geocoding.service';

@Module({
  controllers: [SupermarketsController],
  providers: [SupermarketsService, GeocodingService],
  exports: [SupermarketsService],
})
export class SupermarketsModule {}
