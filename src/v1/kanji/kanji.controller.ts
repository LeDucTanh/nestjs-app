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
import { FilterOptionType, KanjiService } from './kanji.service';
import { Kanji } from './entities/kanji.entity';
import { ImageFileType } from '../image-file/entities/image-file.entity';

@Controller('kanji')
export class KanjiController {
  constructor(private readonly kanjiService: KanjiService) {}

  @Post()
  create(@Body() createKanjiDto: Partial<Kanji>) {
    return this.kanjiService.create(createKanjiDto);
  }

  // @Post('normalize-all')
  // async normalizeAllKanji() {
  //   return this.kanjiService.normalizeAllKanji();
  // }

  @Get()
  findAll() {
    return this.kanjiService.findAll();
  }

  // @Get('read-text')
  // async readTextFromImage(): Promise<string[]> {
  //   return this.kanjiService.handleReadTextFromImage();
  // }

  @Get('search')
  async searchKanji(
    @Query('keyWord') keyWord: string,
    @Query('type') type: FilterOptionType,
  ): Promise<Kanji[]> {
    return this.kanjiService.searchKanji(keyWord.trim(), type);
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
  async updateNameAndMeaning(
    @Param('id') id: string,
    @Body('name') name: string,
    @Body('meaning') meaning: string,
  ) {
    return this.kanjiService.updateNameAndMeaning(+id, name, meaning);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.kanjiService.remove(+id);
  }
}
