import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { KanjiService } from './kanji.service';
import { KanjiController } from './kanji.controller';
import { Kanji } from './entities/kanji.entity';
import { ImageFileModule } from '../image-file/image-file.module';

@Module({
  imports: [TypeOrmModule.forFeature([Kanji]), ImageFileModule],
  controllers: [KanjiController],
  providers: [KanjiService],
  exports: [KanjiService],
})
export class KanjiModule {}
