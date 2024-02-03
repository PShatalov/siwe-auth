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
  ): Promise<string> {
    const signerAddress = await message.verify({
      signature,
    });
    if (!signerAddress) {
      throw new Error('Verification Failed');
    }
    return JSON.stringify(signerAddress);
  }

  parseSiweMessage(message: string): SiweMessage {
    return new SiweMessage(message);
  }
}
