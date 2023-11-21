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
import { AdminUserController } from './admin-user.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([User, FileUpload]),
    CommonModule,
    forwardRef(() => AuthenticationModule),
  ],
  controllers: [UserController, AdminUserController],
  providers: [UserService, UserRepository, JwtService, ConfigService],
  exports: [UserService],
})
export class UserModule {}
