import { Injectable } from '@nestjs/common';
import { SiweMessage, generateNonce } from 'siwe';
import { RedisService } from 'src/redis/redis.service';

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
    const verificationResult = await message.verify({
      signature,
    });
    const data = verificationResult.data;

    const prevNonce = await this.redisService.get(data.address);

    if (!verificationResult || prevNonce === data.nonce) {
      throw new Error('Verification Failed');
    }

    await this.redisService.set(data.address, data.nonce);

    return data.address;
  }

  parseSiweMessage(message: string): SiweMessage {
    return new SiweMessage(message);
  }
}
