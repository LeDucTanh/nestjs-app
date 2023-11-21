import { Module } from '@nestjs/common';
import { RouterModule, Routes } from '@nestjs/core';
import { UserModule } from 'src/v1/user/user.module';
import { AuthenticationModule } from './auth/authen.module';
import { ArtistModule } from './artist/artist.module';
import { MakeupTypeModule } from './makeup-type/makeup-type.module';
import { MakeupStyleModule } from './makeup-style/makeup-style.module';
import { HairStyleModule } from './hair-style/hair-style.module';
import { PersonalColorModule } from './personal-color/personal-color.module';

const routes: Routes = [
  {
    path: 'v1',
    children: [
      { path: '/', module: UserModule },
      { path: 'auth', module: AuthenticationModule },
      { path: '/', module: ArtistModule },
      { path: '/', module: MakeupStyleModule },
      { path: '/', module: HairStyleModule },
      { path: '/', module: MakeupTypeModule },
      { path: '/', module: PersonalColorModule },
    ],
  },
];


@Module({
  imports: [RouterModule.register(routes)],
  exports: [RouterModule],
})
export class V1Route {}
