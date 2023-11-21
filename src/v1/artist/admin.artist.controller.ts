import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ArtistSvc } from './artist.service';
import { CreateArtistDto } from './dto/create-artist.dto';
import { UpdateArtistDto } from './dto/update-artist.dto';

@Controller('admin/artist')
export class AdminArtistController {
  constructor(private readonly artistService: ArtistSvc) {}

  @Post()
  create(@Body() createArtistDto: CreateArtistDto) {
   return this.artistService.create(createArtistDto);
  }

  //@Auth(ANY_PERMISSION)
  @Get()
  findAll() {
    return 'aaaaaa';
  }

  //@Auth(ANY_PERMISSION)
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.artistService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateArtistDto: UpdateArtistDto) {
    return this.artistService.update(+id, updateArtistDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.artistService.remove(+id);
  }
}
