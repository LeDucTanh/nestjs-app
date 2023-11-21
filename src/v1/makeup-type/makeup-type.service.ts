import { Injectable } from '@nestjs/common';
import { MakeupType } from '../user/entities/makeup-type.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class MakeupTypeService {
  constructor(
    @InjectRepository(MakeupType)
    private readonly repo: Repository<MakeupType>,
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
