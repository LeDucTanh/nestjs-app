import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  UploadedFile,
  UseInterceptors,
  Query,
  Res,
  StreamableFile,
} from '@nestjs/common';
import { ImageFileService } from './image-file.service';
import { ImageFileType } from './entities/image-file.entity';
import { FileInterceptor } from '@nestjs/platform-express';
import { Response as ResponseExpress } from 'express';
import { Readable } from 'stream';

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

  @Get()
  async getImageById(
    @Query('id') id: string,
    @Res() response: ResponseExpress,
  ) {
    const entity = await this.imageFileService.findOne(+id);

    response.set({
      'Content-Type': 'image/png',
      'Content-Length': entity.data.length,
    });

    return response.send(entity.data);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.imageFileService.findOneWithoutData(+id);
  }
}
