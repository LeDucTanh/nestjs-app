import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { UserModule } from 'src/v1/user/user.module';
import { AuthenticationController } from './authen.controller';
import { AuthenticationService } from './authen.service';
import { JwtRefreshTokenStrategy } from './strategy/jwt-refresh-token.strategy';
import { JwtStrategy } from './strategy/jwt.strategy';
import { RedisCacheModule } from 'src/cache/cache.module';
import { CacheService } from 'src/cache/cache.service';

@Module({
  imports: [
    UserModule,
    PassportModule,
    ConfigModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get('jwt.accessTokenSecret'),
        signOptions: {
          expiresIn: `${configService.get('jwt.accessTokenExpirationTime')}s`,
        },
      }),
    }),
  ],
  providers: [
    AuthenticationService,
    JwtStrategy,
    JwtRefreshTokenStrategy,
    CacheService,
  ],
  controllers: [AuthenticationController],
  exports: [AuthenticationService],
})
export class AuthenticationModule {}
