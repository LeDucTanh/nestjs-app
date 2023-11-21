import { WithTimestamp } from 'src/utils/app-base.entity';
import { Column, Entity, OneToMany } from 'typeorm';
import { User } from './user.entity';

@Entity()
export class MakeupStyle extends WithTimestamp {
  @Column()
  name: string;

  @OneToMany(() => User, (_) => _.makeupStyle)
  users: User[];
}
