import { Controller } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
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
    return await this.siweService.verifySiweMessage(
      this.siweService.parseSiweMessage(data.message),
      data.signature,
    );
  }
}
