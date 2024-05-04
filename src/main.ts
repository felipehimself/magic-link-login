import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import * as cookieParser from 'cookie-parser';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.use(cookieParser());
  app.setGlobalPrefix('api');

  const origin = process.env.FRONTEND_URL;

  app.enableCors({ origin: origin, credentials: true });

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
    }),

    new ValidationPipe({
      transform: true,
      transformOptions: { groups: ['transform'] },
    }),
  );

  const port = process.env.PORT ?? 3000;

  await app.listen(port);
}
bootstrap();
