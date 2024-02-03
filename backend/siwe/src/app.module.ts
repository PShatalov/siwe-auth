import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { SiweModule } from './siwe/siwe.module';
import { SiweService } from './siwe/siwe.service';

@Module({
  imports: [SiweModule],
  controllers: [AppController],
  providers: [AppService, SiweService],
})
export class AppModule {}
