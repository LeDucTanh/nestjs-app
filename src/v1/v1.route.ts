import { Module } from '@nestjs/common';
import { RouterModule, Routes } from '@nestjs/core';
import { UserModule } from 'src/v1/user/user.module';
import { AuthenticationModule } from './auth/authen.module';

const routes: Routes = [
  {
    path: 'v1',
    children: [
      { path: '/', module: UserModule },
      { path: 'auth', module: AuthenticationModule },
    ],
  },
];

@Module({
  imports: [RouterModule.register(routes)],
  exports: [RouterModule],
})
export class V1Route {}
