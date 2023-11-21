import {
  BaseEntity,
  DeepPartial,
  FindManyOptions,
  FindOneOptions,
  FindOptionsRelations,
  FindOptionsSelect,
  FindOptionsWhere,
  RemoveOptions,
  Repository,
  SaveOptions,
} from 'typeorm';
import { QueryDeepPartialEntity } from 'typeorm/query-builder/QueryPartialEntity';
import { IBaseRepository } from './base.repository.interface';

export class BaseRepository<T extends BaseEntity>
  implements IBaseRepository<T>
{
  constructor(private readonly repository: Repository<T>) {}

  get tableName(): string {
    return this.repository.metadata.tableName;
  }

  createQueryBuilder(alias) {
    return this.repository.createQueryBuilder(alias);
  }

  async exists(options?: FindManyOptions<T>): Promise<boolean> {
    return this.repository.exist(options);
  }

  async findOne(options: FindOneOptions<T>): Promise<T> {
    return this.repository.findOne(options);
  }

  async find(options?: FindManyOptions<T>): Promise<T[]> {
    return this.repository.find(options);
  }

  async findAndCount(options?: FindManyOptions<T>): Promise<[T[], number]> {
    return this.repository.findAndCount(options);
  }

  async count(options?: FindManyOptions<T>): Promise<number> {
    return this.repository.count(options);
  }

  async save(
    entities: T | T[] | any,
    options?: SaveOptions,
  ): Promise<T | T[] | any> {
    return this.repository.save(entities, options);
  }

  createEntity(dataCreate: DeepPartial<T>): T {
    const result: T = this.repository.create(dataCreate);
    return result;
  }

  async create(dataCreate: DeepPartial<T>): Promise<T> {
    const result: T = this.repository.create(dataCreate);
    await this.repository.save(result);
    return result;
  }

  async updateOneAndReturnById(
    id: number,
    data: QueryDeepPartialEntity<T>,
    options: FindOneOptions<T>,
  ): Promise<T> {
    await this.repository.update(id, data);
    const where: FindOptionsWhere<T> | any = { id };
    return this.repository.findOne({ where, ...options });
  }

  async updateOneById(
    id: number,
    data: QueryDeepPartialEntity<T>,
  ): Promise<void> {
    await this.repository.update(id, data);
  }

  async update(
    criteria:
      | string
      | string[]
      | number
      | number[]
      | Date
      | Date[]
      | FindOptionsWhere<T>,
    data: QueryDeepPartialEntity<T>,
  ): Promise<void> {
    await this.repository.update(criteria, data);
  }

  async findOneByOrFail(id: number): Promise<T> {
    const where: FindOptionsWhere<T> | any = { id };
    return this.repository.findOneByOrFail(where);
  }

  async delete(where: FindOptionsWhere<T>): Promise<void> {
    await this.repository.delete(where);
  }

  async softDelete(
    criteria:
      | string
      | number
      | FindOptionsWhere<T>
      | Date
      | string[]
      | number[]
      | Date[],
  ): Promise<void> {
    await this.repository.softDelete(criteria);
  }

  remove(entityOrEntities: T | T[], options?: RemoveOptions): Promise<T | T[]> {
    if (Array.isArray(entityOrEntities)) {
      return this.repository.remove(entityOrEntities, options);
    } else {
      return this.repository.remove(entityOrEntities, options);
    }
  }

  async softRemove(
    id: number,
    options: FindOneOptions<T>,
    saveOptions?: SaveOptions,
  ): Promise<void> {
    const where: FindOptionsWhere<T> | any = { id };
    const entity = await this.repository.findOne({ ...options, ...where });
    await entity.softRemove(saveOptions);
  }

  async restore(
    criteria:
      | string
      | number
      | FindOptionsWhere<T>
      | Date
      | string[]
      | number[]
      | Date[],
  ): Promise<void> {
    await this.repository.restore(criteria);
  }
}
