import { Injectable } from '@nestjs/common';
import { SiweMessage, generateNonce } from 'siwe';
import { RedisService } from 'src/siwe/redis.service';

@Injectable()
export class SiweService {
  constructor(private readonly redisService: RedisService) {}

  generateNonce() {
    return generateNonce();
  }

  async verifySiweMessage(
    message: SiweMessage,
    signature: string,
  ): Promise<string> {
    const signerAddress = await message.verify({
      signature,
    });
    const prevNonce = await this.redisService.get(signerAddress.data.address);
    if (!signerAddress || prevNonce === signerAddress.data.nonce) {
      throw new Error('Verification Failed');
    }
    await this.redisService.set(
      signerAddress.data.address,
      signerAddress.data.nonce,
    );
    return JSON.stringify(signerAddress);
  }

  parseSiweMessage(message: string): SiweMessage {
    return new SiweMessage(message);
  }
}
