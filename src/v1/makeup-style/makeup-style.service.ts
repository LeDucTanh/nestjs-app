import { Injectable } from '@nestjs/common';
import { MakeupStyle } from '../user/entities/makeup-style.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class MakeupStyleService {
  constructor(
    @InjectRepository(MakeupStyle)
    private readonly repo: Repository<MakeupStyle>,
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
