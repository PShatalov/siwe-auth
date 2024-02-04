import { Module } from '@nestjs/common';
import { RedisModule } from 'src/redis/redis.module';
import { SiweService } from './siwe.service';

@Module({
  imports: [RedisModule],
  providers: [SiweService],
  exports: [SiweService],
})
export class SiweModule {}
