import { Injectable } from '@nestjs/common';
import { CreateArtistDto } from './dto/create-artist.dto';
import { UpdateArtistDto } from './dto/update-artist.dto';
import { Artist } from './entities/artist.entity';
import { BaseService } from '../../base/base.service';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class ArtistSvc {
  constructor(
    @InjectRepository(Artist) private artistRepository: Repository<Artist>,
  ) {}
  create(createArtistDto: CreateArtistDto) {
     return 'This action adds a new artist';
  }

  findAll() {
    return `This action returns all artist`;
  }

  async findOne(id: number) {
    return this.artistRepository.findOne({
      where: {
        id: id,
      },
    });
  }
  update(id: number, updateArtistDto: UpdateArtistDto) {
    return `This action updates a #${id} artist`;
  }

  remove(id: number) {
    return `This action removes a #${id} artist`;
  }
}
