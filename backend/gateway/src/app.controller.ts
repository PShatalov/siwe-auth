import { Controller, Get, Inject, Post, Body } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { AppService } from './app.service';

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
  signUp(@Body() body) {
    return this.siweClient.send({ cmd: 'siwe_verify' }, body);
  }
}
