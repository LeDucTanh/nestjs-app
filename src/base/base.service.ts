import {
  BaseEntity,
  DeepPartial,
  FindManyOptions,
  FindOneOptions, FindOptionsWhere,
  SaveOptions
} from 'typeorm';
import { QueryDeepPartialEntity } from 'typeorm/query-builder/QueryPartialEntity';
import { BaseRepository } from './base.repository';
import { IBaseService } from './base.service.interface';

export class BaseService<T extends BaseEntity, R extends BaseRepository<T>> implements IBaseService<T> {
  
  protected readonly repository: R;

  constructor(repository: R) {
    this.repository = repository;
  }

  async exists(options: FindManyOptions<T>): Promise<boolean> {
    return this.repository.exists(options);
  }

  async findOne(options: FindOneOptions<T>): Promise<T> {
    return this.repository.findOne(options);
  }

  async findOneAndCreate(where: FindOptionsWhere<T>, data: DeepPartial<T>): Promise<T> {
    const record = await this.repository.findOne({ where });
    if (record) return record;
    return this.repository.create(data);
  }

  async find(options?: FindManyOptions): Promise<T[]> {
    return this.repository.find(options);
  }

  async findAndCount(options?: FindManyOptions): Promise<[T[], number]> {
    return this.repository.findAndCount(options);
  }

  async findOneByOrFail(id: number): Promise<T> {
    return this.repository.findOneByOrFail(id);
  }

  async create(dataCr: DeepPartial<T>): Promise<T> {
    return this.repository.create(dataCr);
  }

  async save(entities: any, options?: SaveOptions): Promise<any> {
    return this.repository.save(entities, options);
  }

  async updateOneById(id: number, data: QueryDeepPartialEntity<T>): Promise<void> {
    await this.repository.updateOneById(id, data);
  }

  async update(criteria: any, data: QueryDeepPartialEntity<T>): Promise<void> {
    await this.repository.update(criteria, data);
  }
}
