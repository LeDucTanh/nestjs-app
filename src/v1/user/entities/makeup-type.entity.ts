import { WithTimestamp } from 'src/utils/app-base.entity';
import { Column, Entity, OneToMany } from 'typeorm';
import { User } from './user.entity';

@Entity()
export class MakeupType extends WithTimestamp {
  @Column()
  name: string;

  @OneToMany(() => User, (_) => _.makeupType)
  users: User[];
}
