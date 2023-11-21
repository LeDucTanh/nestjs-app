import { Module } from '@nestjs/common';
import { HairStyleService } from './hair-style.service';
import { HairStyleController } from './hair-style.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { HairStyle } from '../user/entities/hair-style.entity';
import { IsHairStyleExist } from './validator/validator';

@Module({
  imports: [TypeOrmModule.forFeature([HairStyle])],
  controllers: [HairStyleController],
  providers: [HairStyleService, IsHairStyleExist],
  exports: [HairStyleService],
})
export class HairStyleModule {}
