import { WithTimestamp } from 'src/utils/app-base.entity';
import {
  BeforeInsert,
  Column,
  Entity,
  Index,
  JoinColumn,
  OneToMany,
  OneToOne,
} from 'typeorm';
import { genSaltSync, hashSync } from 'bcrypt';
import { instanceToPlain } from 'class-transformer';
import { BankAccount } from 'src/v1/bank-account/entities/bank-account.entity';
import { Transaction } from 'src/v1/transaction/entities/transaction.entity';

export enum UserRole {
  User = 'USER',
  Admin = 'ADMIN',
  SuperAdmin = 'SUPER_ADMIN',
  Any = 'ANY',
}

export enum UserStatus {
  Active = 'ACTIVE',
  Deactivated = 'DEACTIVATED',
}

@Entity('user')
export class User extends WithTimestamp {
  @Index()
  @Column({
    type: 'enum',
    enum: [UserRole.User, UserRole.Admin, UserRole.SuperAdmin],
    default: UserRole.User,
  })
  role: UserRole;

  @Index()
  @Column({ type: 'enum', enum: UserStatus, default: UserStatus.Active })
  status: UserStatus;

  @Column('varchar', { length: 65, nullable: true })
  username: string;

  @Column('varchar', { length: 255, nullable: true })
  password: string;

  @Column('varchar', { length: 65, nullable: true })
  phoneNumber: string;

  @Column('varchar', { nullable: true, length: 255 })
  email: string;

  @OneToMany(() => BankAccount, (_) => _.user)
  accounts: BankAccount[];

  @OneToMany(() => Transaction, (_) => _.user)
  transactions: Transaction[];

  @BeforeInsert()
  hashPassword(): void {
    const self = this;
    if (self.password) {
      const salt = genSaltSync(10);
      self.password = hashSync(self.password, salt);
    }
  }

  toJSON() {
    const result = instanceToPlain(this);
    delete result.password;
    return result;
  }
}
