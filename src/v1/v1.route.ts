import { Module } from '@nestjs/common';
import { RouterModule, Routes } from '@nestjs/core';
import { UserModule } from 'src/v1/user/user.module';
import { AuthenticationModule } from './auth/authen.module';
import { BankAccountModule } from './bank-account/bank-account.module';
import { TransactionModule } from './transaction/transaction.module';

const routes: Routes = [
  {
    path: 'v1',
    children: [
      { path: '/', module: UserModule },
      { path: 'auth', module: AuthenticationModule },
      { path: '/', module: BankAccountModule },
      { path: '/', module: TransactionModule },
    ],
  },
];

@Module({
  imports: [RouterModule.register(routes)],
  exports: [RouterModule],
})
export class V1Route {}
