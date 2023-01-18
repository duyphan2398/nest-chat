import {NestFactory} from '@nestjs/core';
import {AppModule} from './app.module';
import {SwaggerModule} from '@nestjs/swagger';
import {swaggerConfig} from './core/swagger/swagger-config';
import {I18nValidationPipe} from 'nestjs-i18n';
import {useContainer} from 'class-validator';

async function bootstrap() {
    const app = await NestFactory.create(AppModule);

    app.enableCors({
        allowedHeaders: '*',
        origin: '*',
        credentials: true,
    });

    useContainer(app.select(AppModule), {fallbackOnErrors: true});

    // Use Pipes
    app.useGlobalPipes(
        new I18nValidationPipe({
            whitelist: true,
        }),
    );

    // Enable Swagger
    const document = SwaggerModule.createDocument(app, swaggerConfig);
    SwaggerModule.setup('docs', app, document);

    await app.listen(3000);
}

bootstrap();
