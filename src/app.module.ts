import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmConfig } from './core/typeorm/typeorm-config';
import { ChatsModule } from './modules/chats/chats.module';
import { AcceptLanguageResolver, I18nModule, QueryResolver } from 'nestjs-i18n';
import { HttpExceptionFilter } from './core/exceptions/http-exception.filter';
import { APP_FILTER } from '@nestjs/core';
import * as path from 'path';
import { Global } from '@nestjs/common';
import { I18nException } from './core/exceptions/i18n.exception';

@Global()
@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: `.env.${process.env.NODE_ENV}`,
    }),
    TypeOrmModule.forRootAsync({
      useClass: TypeOrmConfig,
    }),
    I18nModule.forRoot({
      fallbackLanguage: process.env.FALLBACK_LANGUAGE || 'en',
      loaderOptions: {
        path: path.join(__dirname, '/dictionaries/'),
        watch: true,
      },
      resolvers: [
        {
          use: QueryResolver,
          options: ['lang'],
        },
        AcceptLanguageResolver,
      ],
    }),

    ChatsModule,
  ],
  controllers: [],
  providers: [
    {
      provide: APP_FILTER,
      useClass: HttpExceptionFilter,
    },
    {
      provide: APP_FILTER,
      useClass: I18nException,
    },
  ],
})
export class AppModule {}
