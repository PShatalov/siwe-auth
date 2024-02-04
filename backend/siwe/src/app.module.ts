import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { RedisModule } from './redis/redis.module';
import { SiweModule } from './siwe/siwe.module';

@Module({
  imports: [SiweModule, RedisModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
