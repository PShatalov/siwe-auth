import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { SiweService } from './siwe.service';

@Injectable()
export class SiweAuthGuard implements CanActivate {
  constructor(private readonly siweService: SiweService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const signature = request.headers['x-signature'];
    const message = request.headers['x-siwe-message'];
    const nonce = request.headers['x-nonce'];

    if (!signature || !nonce || !message) {
      return false;
    }

    const siweMessage = this.siweService.parseSiweMessage(message);
    //return this.siweService.verifySiweMessage(siweMessage, signature);
    return true;
  }
}
