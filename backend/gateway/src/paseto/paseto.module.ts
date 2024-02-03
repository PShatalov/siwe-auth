import { Module } from '@nestjs/common';
import { PasetoAuthGuard } from './paseto-auth.guard';
import { PasetoService } from './paseto.service';

@Module({
  imports: [],
  providers: [PasetoService, PasetoAuthGuard],
})
export class PasetoModule {}
