import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Put,
  Query,
} from '@nestjs/common';
import { KanjiService } from './kanji.service';
import { Kanji } from './entities/kanji.entity';
import { ImageFileType } from '../image-file/entities/image-file.entity';

@Controller('kanji')
export class KanjiController {
  constructor(private readonly kanjiService: KanjiService) {}

  @Post()
  create(@Body() createKanjiDto: Partial<Kanji>) {
    return this.kanjiService.create(createKanjiDto);
  }

  @Get()
  findAll() {
    return this.kanjiService.findAll();
  }

  // @Get('read-text')
  // async readTextFromImage(): Promise<string[]> {
  //   return this.kanjiService.handleReadTextFromImage();
  // }

  @Get('search')
  async searchKanji(@Query('keyWord') keyWord: string): Promise<Kanji[]> {
    return this.kanjiService.searchKanji(keyWord.trim());
  }

  @Get('crop-images')
  async cropKanjiImages(@Query('type') type: ImageFileType) {
    return this.kanjiService.cropKanjiImages(type);
  }

  @Get('detect-crop')
  async cropKanji() {
    return this.kanjiService.detectAndCropImages();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.kanjiService.findOne(+id);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() updateKanjiDto: Partial<Kanji>) {
    return this.kanjiService.update(+id, updateKanjiDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.kanjiService.remove(+id);
  }
}
