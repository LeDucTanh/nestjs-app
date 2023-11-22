import { IsNotEmpty, IsNumber } from 'class-validator';

export class TransactionDto {
  @IsNumber()
  @IsNotEmpty()
  accountId: number;
}
