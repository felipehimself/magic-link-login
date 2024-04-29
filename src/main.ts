import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import * as cookieParser from 'cookie-parser';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.use(cookieParser());
  app.setGlobalPrefix('api');
  app.enableCors({ origin: 'http://localhost:5173', credentials: true });

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
    }),

    new ValidationPipe({
      transform: true,
      transformOptions: { groups: ['transform'] },
    }),
  );

  await app.listen(3000);
}
bootstrap();
