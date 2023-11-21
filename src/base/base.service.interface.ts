import {
  DeepPartial,
  FindManyOptions,
  FindOneOptions,
  FindOptionsWhere,
  SaveOptions,
} from 'typeorm';
import { QueryDeepPartialEntity } from 'typeorm/query-builder/QueryPartialEntity';

export interface IBaseService<T> {
  exists(options?: FindManyOptions<T>): Promise<boolean>;
  findOne(options: FindOneOptions<T>): Promise<T>;
  findOneAndCreate(
    where: FindOptionsWhere<T>,
    data: DeepPartial<T>,
  ): Promise<T>;
  findOneByOrFail(id: number): Promise<T>;
  find(options?: FindManyOptions<T>): Promise<T[]>;
  findAndCount(options?: FindManyOptions<T>): Promise<[T[], number]>;
  create(dataCreate: DeepPartial<T>): Promise<T>;
  save(
    entities: T | DeepPartial<T>[] | any,
    options: SaveOptions,
  ): Promise<any>;
  updateOneById(id: number, data: QueryDeepPartialEntity<T>): Promise<void>;
  update(
    criteria:
      | string
      | string[]
      | number
      | number[]
      | Date
      | Date[]
      | FindOptionsWhere<T>,
    data: QueryDeepPartialEntity<T>,
  ): Promise<void>;
}
