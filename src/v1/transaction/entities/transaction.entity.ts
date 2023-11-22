import { Entity, Column, Index } from 'typeorm';
import { WithTimestamp } from 'src/utils/app-base.entity';
import { ColumnNumericTransformer } from 'src/utils/transformers/column-numeric.transformer';

export enum AccountStatus {
  Active = 'ACTIVE',
  Suspended = 'SUSPENDED',
  Deleted = 'DELETED',
}

@Entity({ name: 'transaction' })
export class Transaction extends WithTimestamp {
  @Index()
  @Column({ type: 'enum', enum: AccountStatus, default: AccountStatus.Active })
  status: AccountStatus;

  @Column('decimal', {
    name: 'currentAmount',
    precision: 12,
    default: 0,
    transformer: new ColumnNumericTransformer(),
  })
  currentAmount: number;
}
