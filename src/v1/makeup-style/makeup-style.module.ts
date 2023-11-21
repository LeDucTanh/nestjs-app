import { Module } from '@nestjs/common';
import { MakeupStyleService } from './makeup-style.service';
import { MakeupStyleController } from './makeup-style.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MakeupStyle } from '../user/entities/makeup-style.entity';
import { IsMakeupStyleExist } from './validator/validator';

@Module({
  imports: [TypeOrmModule.forFeature([MakeupStyle])],
  controllers: [MakeupStyleController],
  providers: [MakeupStyleService, IsMakeupStyleExist],
  exports: [MakeupStyleService],
})
export class MakeupStyleModule {}
