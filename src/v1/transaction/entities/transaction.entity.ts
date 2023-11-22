import { Entity, Column, Index, ManyToOne, JoinColumn } from 'typeorm';
import { WithTimestamp } from 'src/utils/app-base.entity';
import { ColumnNumericTransformer } from 'src/utils/transformers/column-numeric.transformer';
import { User } from 'src/v1/user/entities/user.entity';
import { BankAccount } from 'src/v1/bank-account/entities/bank-account.entity';

export enum TransactionType {
  Transfer = 'TRANSFER',
  Deposit = 'DEPOSIT',
  Withdraw = 'WITHDRAW',
}

@Entity({ name: 'transaction' })
export class Transaction extends WithTimestamp {
  @Index()
  @Column({
    type: 'enum',
    enum: TransactionType,
    default: TransactionType.Transfer,
  })
  type: TransactionType;

  @Column('decimal', {
    name: 'amount',
    precision: 12,
    default: 0,
    transformer: new ColumnNumericTransformer(),
  })
  amount: number;

  @Column('varchar', { length: 65, nullable: true })
  otherAccountNumber: string;

  @Column({ type: 'integer' })
  userId: number;

  @Column({ type: 'integer', nullable: true })
  otherUserId: number;

  @Column({ type: 'integer' })
  accountId: number;

  @ManyToOne(() => User, (_) => _.transactions, {
    orphanedRowAction: 'delete',
  })
  @JoinColumn({ name: 'userId', referencedColumnName: 'id' })
  user: User;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'otherUserId', referencedColumnName: 'id' })
  otherUser: User;

  @ManyToOne(() => BankAccount, (_) => _.transactions, {
    orphanedRowAction: 'delete',
  })
  @JoinColumn({ name: 'accountId', referencedColumnName: 'id' })
  account: BankAccount;
}
