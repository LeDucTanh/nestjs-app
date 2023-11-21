import { Injectable } from '@nestjs/common';
import { HairStyle } from '../user/entities/hair-style.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class HairStyleService {
  constructor(
    @InjectRepository(HairStyle)
    private readonly repo: Repository<HairStyle>,
  ) {}

  findAll() {
    return this.repo.find({
      select: ['id', 'name'],
    });
  }

  findOne(id: number) {
    return this.repo.findOne({
      where: {
        id,
      },
    });
  }
}
