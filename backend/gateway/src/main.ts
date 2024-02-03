import * as fs from 'fs';
import { NestFactory } from '@nestjs/core';
import { HttpsOptions } from '@nestjs/common/interfaces/external/https-options.interface';

import { AppModule } from './app.module';

async function bootstrap() {
  const httpsOptions: HttpsOptions = {
    key: fs.readFileSync('./server.key'),
    cert: fs.readFileSync('./server.cert'),
  };

  const app = await NestFactory.create(AppModule, { httpsOptions });
  app.enableCors();
  await app.listen(4000);
}
bootstrap();
