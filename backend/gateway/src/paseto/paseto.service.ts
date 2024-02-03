import { Injectable } from '@nestjs/common';
import { V4 } from 'paseto';

@Injectable()
export class PasetoService {
  private readonly privateKey: string;
  private readonly publicKey: string;

  constructor() {
    this.privateKey = process.env.PASETO_PRIVATE_KEY;
    this.publicKey = process.env.PASETO_PUBLIC_KEY;
  }

  async createToken(payload: { eoaAddress: string }): Promise<string> {
    return V4.sign(payload, this.privateKey, { expiresIn: '1h' });
  }

  async verifyToken(token: string): Promise<object> {
    return V4.verify(token, this.publicKey);
  }
}
