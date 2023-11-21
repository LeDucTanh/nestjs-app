import {
  DeepPartial, FindManyOptions, FindOneOptions, FindOptionsWhere,
  ObjectID,
  SaveOptions
} from 'typeorm';
import { QueryDeepPartialEntity } from 'typeorm/query-builder/QueryPartialEntity';

export interface IBaseRepository<T> {
  exists(options?: FindManyOptions<T>): Promise<boolean> ;
  findOne(options: FindOneOptions<T>): Promise<T>;
  find(options?: FindManyOptions<T>): Promise<T[]>;
  findAndCount(options?: FindManyOptions<T>): Promise<[T[], number]>;  
  count(options?: FindManyOptions<T>): Promise<number> ;
  save(entities: T | T[] | any, options?: SaveOptions): Promise<T | T[] | any>;
  create(dataCreate: DeepPartial<T> ): Promise<T> ;
  updateOneAndReturnById(id: number,data: QueryDeepPartialEntity<T>,options: FindOneOptions<T>): Promise<T>;
  updateOneById(id: number, data: QueryDeepPartialEntity<T>): Promise<void>;
  update(criteria: string | string[] | number | number[] | Date | Date[] | ObjectID | ObjectID[] | FindOptionsWhere<T>, data: QueryDeepPartialEntity<T>): Promise<void>;
  findOneByOrFail(id: number): Promise<T>;
  delete(where: FindOptionsWhere<T>): Promise<void>;
  softDelete(criteria: string | number | FindOptionsWhere<T> | Date | ObjectID | string[] | number[] | Date[] | ObjectID[]): Promise<void>;
  softRemove(id: number, options: FindOneOptions<T>, saveOptions?: SaveOptions): Promise<void>;
  restore( criteria: string | number | FindOptionsWhere<T> | Date | ObjectID | string[] | number[] | Date[] | ObjectID[]): Promise<void>;
}
