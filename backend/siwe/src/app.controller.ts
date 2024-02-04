import { Controller, UnauthorizedException } from '@nestjs/common';
import { MessagePattern, RpcException } from '@nestjs/microservices';
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
    try {
      return await this.siweService.verifySiweMessage(
        this.siweService.parseSiweMessage(data.message),
        data.signature,
      );
    } catch (err) {
      throw new RpcException(
        new UnauthorizedException('Unable to verify message'),
      );
    }
  }
}
