import 'dotenv/config';
import { NestFactory } from '@nestjs/core';
import { Logger } from '@nestjs/common';

import { AppModule } from './app.module';
import { ValidationPipe } from './shared/validation.pipe';

const port = process.env.PORT || 8080;

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors({
    origin: [
      'http://localhost:4200', // angular
      'http://localhost:3000', // react
      'http://localhost:8081', // react-native
    ],
  });
  app.useGlobalPipes(new ValidationPipe());
  await app.listen(port);
  Logger.log(`Server running on http//localhost:${port}`, 'Bootstrap');
}
bootstrap();
