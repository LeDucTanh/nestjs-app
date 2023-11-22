import {
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  MaxLength,
  Min,
  MinLength,
} from 'class-validator';
import { AccountType } from '../entities/bank-account.entity';
import { i18nValidationMessage } from 'nestjs-i18n';

export class CreateAccountDto {
  @IsOptional()
  @IsNumber()
  totalAmount: number;

  @IsEnum(AccountType)
  @IsNotEmpty()
  type: AccountType;
}

export class GetAccountDto {
  @MaxLength(8)
  @MinLength(8)
  @IsString()
  @IsNotEmpty()
  accountNumber: string;
}

export class TransferDto {
  @IsNumber()
  @IsNotEmpty()
  accountId: number;

  @IsString()
  @IsNotEmpty()
  toAccountNumber: string;

  @Min(20000, {
    message: i18nValidationMessage('validations.AMOUNT_LIMIT'),
  })
  @IsNumber()
  @IsNotEmpty()
  amount: number;
}

export class WithdrawDto {
  @IsNumber()
  @IsNotEmpty()
  accountId: number;

  @Min(20000, {
    message: i18nValidationMessage('validations.AMOUNT_LIMIT'),
  })
  @IsNumber()
  @IsNotEmpty()
  amount: number;
}
