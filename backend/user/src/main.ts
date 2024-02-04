import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.REDIS,
    options: {
      port: Number(process.env.REDIS_PORT),
      host: process.env.REDIS_HOST,
    },
  });
  await app.startAllMicroservices();
  await app.listen(process.env.PORT);
}
bootstrap();
