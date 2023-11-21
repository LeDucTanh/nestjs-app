import { Module } from '@nestjs/common';
import { PersonalColorService } from './personal-color.service';
import { PersonalColorController } from './personal-color.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PersonalColor } from '../user/entities/personal-color.entity';
import { IsPersonalColorExist } from './validator/validator';

@Module({
  imports: [TypeOrmModule.forFeature([PersonalColor])],
  controllers: [PersonalColorController],
  providers: [PersonalColorService, IsPersonalColorExist],
  exports: [PersonalColorService],
})
export class PersonalColorModule {}
