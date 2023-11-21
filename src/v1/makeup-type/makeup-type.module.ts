import { Module } from '@nestjs/common';
import { MakeupTypeService } from './makeup-type.service';
import { MakeupTypeController } from './makeup-type.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MakeupType } from '../user/entities/makeup-type.entity';
import { IsMakeupTypeExist } from './validator/validator';

@Module({
  imports: [TypeOrmModule.forFeature([MakeupType])],
  controllers: [MakeupTypeController],
  providers: [MakeupTypeService, IsMakeupTypeExist],
  exports: [MakeupTypeService],
})
export class MakeupTypeModule {}
