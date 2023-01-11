import { DocumentBuilder } from '@nestjs/swagger';

export const swaggerConfig = new DocumentBuilder()
  .setTitle('APE NestJS Chat')
  .setDescription('The APE NestJS Chat APIs document')
  .setVersion('1.0')
  .build();
