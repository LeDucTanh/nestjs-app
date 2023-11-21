import { Injectable } from '@nestjs/common';
import { PersonalColor } from '../user/entities/personal-color.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class PersonalColorService {
  constructor(
    @InjectRepository(PersonalColor)
    private readonly repo: Repository<PersonalColor>,
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
