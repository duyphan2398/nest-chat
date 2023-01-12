import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SwaggerModule } from '@nestjs/swagger';
import { swaggerConfig } from './core/swagger/swagger-config';
import {I18nValidationExceptionFilter, I18nValidationPipe} from "nestjs-i18n";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);


  // Use Pipes
  app.useGlobalPipes(
      new I18nValidationPipe(),
  );

  // Use Filter
  app.useGlobalFilters(
      new I18nValidationExceptionFilter()
  );

  // Enable Swagger
  const document = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup('docs', app, document);


  await app.listen(3000);
}

bootstrap();
