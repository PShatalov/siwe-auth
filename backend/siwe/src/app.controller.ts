import { Controller, UseGuards } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { SiweAuthGuard } from './siwe/siwe-auth.guard';
import { SiweService } from './siwe/siwe.service';

@Controller()
export class AppController {
  constructor(private readonly siweService: SiweService) {}

  @MessagePattern({ cmd: 'siwe_get_nonce' })
  getNonce(): string {
    return this.siweService.generateNonce();
  }

  @MessagePattern({ cmd: 'siwe_verify' })
  async verify(data: { message: string; signature: string }): Promise<string> {
    console.log('SIWE Verify', JSON.stringify(data));
    return await this.siweService.verifySiweMessage(
      this.siweService.parseSiweMessage(data.message),
      data.signature,
    );
  }
}
