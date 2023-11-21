import { Module } from '@nestjs/common';
import { AuthenticationModule } from './auth/authen.module';
import { UserModule } from './user/user.module';
import { V1Route } from './v1.route';

@Module({
  imports: [V1Route, AuthenticationModule, UserModule],
  controllers: [],
  providers: [],
})
export class V1Module {}
