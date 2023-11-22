import { Module } from '@nestjs/common';
import { AuthenticationModule } from './auth/authen.module';
import { UserModule } from './user/user.module';
import { V1Route } from './v1.route';
import { BankAccountModule } from './bank-account/bank-account.module';
import { TransactionModule } from './transaction/transaction.module';

@Module({
  imports: [
    V1Route,
    AuthenticationModule,
    UserModule,
    BankAccountModule,
    TransactionModule,
  ],
  controllers: [],
  providers: [],
})
export class V1Module {}
