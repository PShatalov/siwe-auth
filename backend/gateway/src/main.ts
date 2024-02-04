import * as fs from 'fs';
import { NestFactory } from '@nestjs/core';
import { HttpsOptions } from '@nestjs/common/interfaces/external/https-options.interface';

import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const httpsOptions: HttpsOptions = {
    key: fs.readFileSync('./server.key'),
    cert: fs.readFileSync('./server.cert'),
  };

  const app = await NestFactory.create(AppModule, { httpsOptions });
  app.enableCors();
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );
  await app.listen(4000);
}
bootstrap();
