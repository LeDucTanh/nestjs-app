import { Entity, Column, Index, ManyToOne, JoinColumn } from 'typeorm';
import { WithTimestamp } from 'src/utils/app-base.entity';
import { ColumnNumericTransformer } from 'src/utils/transformers/column-numeric.transformer';
import { User } from 'src/v1/user/entities/user.entity';

export enum AccountStatus {
  Active = 'ACTIVE',
  Suspended = 'SUSPENDED',
  Deleted = 'DELETED',
}

@Entity('bank_account')
export class BankAccount extends WithTimestamp {
  @Index()
  @Column({ type: 'enum', enum: AccountStatus, default: AccountStatus.Active })
  status: AccountStatus;

  @Index('idx_account_number')
  @Column('varchar', { length: 65, unique: true })
  accountNumber: string;

  @Column('decimal', {
    name: 'amount',
    precision: 12,
    default: 0,
    transformer: new ColumnNumericTransformer(),
  })
  amount: number;

  @Column({ type: 'integer', nullable: true })
  userId: number;

  @ManyToOne(() => User, (_) => _.accounts, {
    orphanedRowAction: 'delete',
  })
  @JoinColumn({ name: 'userId', referencedColumnName: 'id' })
  user: User;
}
