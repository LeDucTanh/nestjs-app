import * as redisStore from 'cache-manager-ioredis';
import { Module, CacheModule } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { V1Module } from './v1/v1.module';
import { EnvValidation } from 'config/env.validation';
import jwtConfig from 'config/jwt.config';
import databaseConfig from 'config/database.config';
import appConfig from 'config/app.config';
import { CommonModule } from './common/common.module';
import { config } from 'config/config';
import { RedisCacheModule } from './cache/cache.module';
import {
  AcceptLanguageResolver,
  HeaderResolver,
  I18nModule,
} from 'nestjs-i18n';
import { join } from 'path';
import { APP_FILTER, APP_INTERCEPTOR } from '@nestjs/core';
import { ExceptionsLoggerFilter } from './common/exception-filters/exceptions-logger.filter';
import { ResponseInterceptor } from './common/interceptor/response.interceptor';
import smtpConfig from 'config/smtp.config';

@Module({
  imports: [
    V1Module,
    CommonModule,
    ConfigModule.forRoot({
      validationSchema: EnvValidation,
      isGlobal: true,
      cache: true,
      load: [config, appConfig, jwtConfig, databaseConfig, smtpConfig],
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) =>
        configService.get('database'),
      inject: [ConfigService],
      name: 'default',
    }),
    I18nModule.forRoot({
      fallbackLanguage: 'kr',
      loaderOptions: {
        path: join(process.cwd(), '/src/i18n/'),
        watch: true,
      },
      resolvers: [
        { use: HeaderResolver, options: ['lang'] },
        AcceptLanguageResolver,
      ],
    }),
    CacheModule.register({
      isGlobal: true,
      store: redisStore,

      // Store-specific configuration:
      host: process.env.REDIS_HOST,
      port: process.env.REDIS_PORT,
    }),
    RedisCacheModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    { provide: APP_FILTER, useClass: ExceptionsLoggerFilter },
    {
      provide: APP_INTERCEPTOR,
      useClass: ResponseInterceptor,
    },
  ],
})
export class AppModule {}
