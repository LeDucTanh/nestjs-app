import { InjectRepository } from '@nestjs/typeorm';
import { BaseRepository } from '../../../base/base.repository';
import { Repository } from 'typeorm';
import { User } from '../entities/user.entity';

export class UserRepository extends BaseRepository<User> {
  constructor(@InjectRepository(User) private readonly _repository: Repository<User>) {
    super(_repository);
  }

  /**
   * Add function for custom query 
   * Can be QueryBuilder function
   * */ 

}
