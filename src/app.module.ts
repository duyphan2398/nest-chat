import {Module} from '@nestjs/common';
import {TypeOrmModule} from '@nestjs/typeorm';
import {ConfigModule} from '@nestjs/config';
import {TypeOrmConfig} from './typeorm/typeorm-config';
import {MembersModule} from './modules/members/members.module';
import {AcceptLanguageResolver, I18nModule, QueryResolver} from 'nestjs-i18n';
import {HttpExceptionFilter} from "./exceptions/http-exception.filter";
import {APP_FILTER, APP_GUARD} from "@nestjs/core";
import * as path from 'path';
import  { MomentProvider} from "./providers/moment.provider";
import {Global} from "@nestjs/common";

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
    controllers: [],
    providers: [
        MomentProvider,
        {
            provide: APP_FILTER,
            useClass: HttpExceptionFilter,
        },
    ],
})
export class AppModule {
}
