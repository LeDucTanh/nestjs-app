import {
  Entity,
  Column,
  Index,
  ManyToOne,
  JoinColumn,
  OneToMany,
} from 'typeorm';
import { WithTimestamp } from 'src/utils/app-base.entity';
import { ColumnNumericTransformer } from 'src/utils/transformers/column-numeric.transformer';
import { User } from 'src/v1/user/entities/user.entity';
import { Transaction } from 'src/v1/transaction/entities/transaction.entity';

export enum AccountStatus {
  Active = 'ACTIVE',
  Suspended = 'SUSPENDED',
  Deleted = 'DELETED',
}

export enum AccountType {
  Savings = 'SAVINGS',
  Credit = 'CREDIT',
  Loan = 'LOAN',
}

@Entity('bank_account')
export class BankAccount extends WithTimestamp {
  @Index()
  @Column({ type: 'enum', enum: AccountStatus, default: AccountStatus.Active })
  status: AccountStatus;

  @Column({ type: 'enum', enum: AccountType, default: AccountType.Savings })
  type: AccountType;

  @Index('idx_account_number')
  @Column('varchar', { length: 65, unique: true })
  accountNumber: string;

  @Column('decimal', {
    name: 'totalAmount',
    precision: 12,
    default: 0,
    transformer: new ColumnNumericTransformer(),
  })
  totalAmount: number;

  @Column({ type: 'integer', nullable: true })
  userId: number;

  @ManyToOne(() => User, (_) => _.accounts, {
    orphanedRowAction: 'delete',
  })
  @JoinColumn({ name: 'userId', referencedColumnName: 'id' })
  user: User;

  @OneToMany(() => Transaction, (_) => _.account, {
    cascade: true,
  })
  transactions: Transaction[];
}
