import { Controller, Get, Inject, Post, Body } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { lastValueFrom } from 'rxjs';

@Controller('api/v1')
export class AppController {
  constructor(
    @Inject('USER') private readonly userClient: ClientProxy,
    @Inject('SIWE') private readonly siweClient: ClientProxy,
  ) {}

  @Get('nonce')
  getNonce() {
    return this.siweClient.send({ cmd: 'siwe_get_nonce' }, {});
  }

  @Post('user/signup')
  async signUp(@Body() body) {
    const address = await lastValueFrom(
      this.siweClient.send({ cmd: 'siwe_verify' }, body),
    );

    return this.userClient.send(
      { cmd: 'user_create' },
      { address, username: 'test' },
    );
  }

  @Post('user/signin')
  async signIn(@Body() body) {
    const address = await lastValueFrom(
      this.siweClient.send({ cmd: 'siwe_verify' }, body),
    );

    return this.userClient.send({ cmd: 'user_profile' }, { address });
  }
}
