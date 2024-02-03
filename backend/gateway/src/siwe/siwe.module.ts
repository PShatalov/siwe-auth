import { Module } from '@nestjs/common';
import { SiweAuthGuard } from './siwe-auth.guard';
import { SiweService } from './siwe.service';

@Module({
  imports: [],
  providers: [SiweService, SiweAuthGuard],
})
export class SiweModule {}
