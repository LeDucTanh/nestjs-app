/*
https://docs.nestjs.com/modules
*/

import { Module } from '@nestjs/common';
import { AuthenticationModule } from './auth/authen.module';
import { UserModule } from './user/user.module';
import { V1Route } from './v1.route';
import { MakeupTypeModule } from './makeup-type/makeup-type.module';
import { MakeupStyleModule } from './makeup-style/makeup-style.module';
import { PersonalColorModule } from './personal-color/personal-color.module';
import { HairStyleModule } from './hair-style/hair-style.module';

@Module({
  imports: [
    V1Route,
    AuthenticationModule,
    UserModule,
    MakeupTypeModule,
    MakeupStyleModule,
    PersonalColorModule,
    HairStyleModule,
  ],
  controllers: [],
  providers: [],
})
export class V1Module {}
