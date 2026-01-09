import { Module } from '@nestjs/common';
import { SupermarketsService } from './supermarkets.service';
import { SupermarketsController } from './supermarkets.controller';

@Module({
  controllers: [SupermarketsController],
  providers: [SupermarketsService],
  exports: [SupermarketsService],
})
export class SupermarketsModule {}
