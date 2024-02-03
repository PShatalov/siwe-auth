import { Module } from '@nestjs/common';
import { RedisService } from './redis.service';
import { SiweAuthGuard } from './siwe-auth.guard';
import { SiweService } from './siwe.service';

@Module({
  imports: [],
  providers: [SiweService, SiweAuthGuard, RedisService],
})
export class SiweModule {}
