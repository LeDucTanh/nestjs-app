import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { ImageFileService } from './image-file.service';
import { ImageFileType } from './entities/image-file.entity';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('image-file')
export class ImageFileController {
  constructor(private readonly imageFileService: ImageFileService) {}

  @Post()
  create(@Body() createImageFileDto: any) {
    return this.imageFileService.create(createImageFileDto);
  }

  @Post('convert')
  @UseInterceptors(FileInterceptor('file'))
  async handleConvertImage(
    @Body('type') type: ImageFileType,
    @UploadedFile() file: Express.Multer.File,
  ) {
    return await this.imageFileService.convertPdfToImage(type, file);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.imageFileService.findOne(+id);
  }
}
