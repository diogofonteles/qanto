import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { ViaCepService } from './services/viacep.service';

@Module({
  controllers: [UsersController],
  providers: [UsersService, ViaCepService],
  exports: [UsersService],
})
export class UsersModule {}
