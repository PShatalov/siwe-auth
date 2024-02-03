import { Injectable } from '@nestjs/common';
import { SiweMessage, generateNonce } from 'siwe';

@Injectable()
export class SiweService {
  constructor() {}

  generateNonce() {
    return generateNonce();
  }

  async verifySiweMessage(
    message: SiweMessage,
    signature: string,
    nonce: string,
  ): Promise<boolean> {
    try {
      const signerAddress = await message.verify({
        signature,
        nonce,
      });

      return !!signerAddress;
    } catch (error) {
      console.error('Verification failed', error);
      return false;
    }
  }

  parseSiweMessage(message: string): SiweMessage {
    return new SiweMessage(message);
  }
}
