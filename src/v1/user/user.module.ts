/*
https://docs.nestjs.com/modules
*/

import { Module, forwardRef } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { UserRepository } from './repositories/user.repository';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { CommonModule } from 'src/common/common.module';
import { AuthenticationModule } from '../auth/authen.module';
import { FileUpload } from '../files/entities/file-upload.entity';
import { MakeupStyle } from './entities/makeup-style.entity';
import { HairStyle } from './entities/hair-style.entity';
import { MakeupType } from './entities/makeup-type.entity';
import { PersonalColor } from './entities/personal-color.entity';
import { PersonalColorModule } from '../personal-color/personal-color.module';
import { MakeupStyleModule } from '../makeup-style/makeup-style.module';
import { MakeupTypeModule } from '../makeup-type/makeup-type.module';
import { HairStyleModule } from '../hair-style/hair-style.module';
import { AdminUserController } from './admin-user.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      User,
      FileUpload,
      MakeupStyle,
      HairStyle,
      MakeupType,
      PersonalColor,
    ]),
    CommonModule,
    forwardRef(() => AuthenticationModule),
    PersonalColorModule,
    MakeupStyleModule,
    MakeupTypeModule,
    HairStyleModule,
  ],
  controllers: [UserController, AdminUserController],
  providers: [UserService, UserRepository, JwtService, ConfigService],
  exports: [UserService],
})
export class UserModule {}
