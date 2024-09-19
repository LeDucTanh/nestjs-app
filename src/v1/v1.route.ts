import { Module } from '@nestjs/common';
import { RouterModule, Routes } from '@nestjs/core';
import { UserModule } from 'src/v1/user/user.module';
import { AuthenticationModule } from './auth/authen.module';
import { BankAccountModule } from './bank-account/bank-account.module';
import { TransactionModule } from './transaction/transaction.module';
import { ImageFileModule } from './image-file/image-file.module';
import { KanjiModule } from './kanji/kanji.module';

const routes: Routes = [
  {
    path: 'v1',
    children: [
      { path: '/', module: UserModule },
      { path: 'auth', module: AuthenticationModule },
      { path: '/', module: BankAccountModule },
      { path: '/', module: TransactionModule },
      { path: '/', module: ImageFileModule },
      { path: '/', module: KanjiModule },
    ],
  },
];

@Module({
  imports: [RouterModule.register(routes)],
  exports: [RouterModule],
})
export class V1Route {}
