import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ImageFileService } from './image-file.service';
import { ImageFileController } from './image-file.controller';
import { ImageFile } from './entities/image-file.entity';

@Module({
  imports: [TypeOrmModule.forFeature([ImageFile])],
  controllers: [ImageFileController],
  providers: [ImageFileService],
  exports: [ImageFileService],
})
export class ImageFileModule {}
