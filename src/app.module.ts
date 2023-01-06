import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule} from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmConfig } from './typeorm/typeorm-config';
import { MembersModule } from './modules/members/members.module';
import * as path from 'path';
import {
  AcceptLanguageResolver,
  I18nModule,
  QueryResolver,
} from 'nestjs-i18n';
import {HttpExceptionFilter} from "./exceptions/http-exception.filter";
import {APP_FILTER} from "@nestjs/core";

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
      fallbackLanguage: 'en',
      loaderOptions: {
        path: path.join(__dirname, '/i18n/'),
        watch: true,
      },
      resolvers: [
        {
          use: QueryResolver,
          options: ['lang']
        },
        AcceptLanguageResolver,
      ],
    }),
    MembersModule,
  ],
  controllers: [
      AppController
  ],
  providers: [
      AppService,
    {
      provide: APP_FILTER,
      useClass: HttpExceptionFilter,
    },

  ],
})
export class AppModule {}
