import { Controller, Get, Inject } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { AppService } from './app.service';

@Controller('api/v1')
export class AppController {
  constructor(
    @Inject('USER') private readonly userClient: ClientProxy,
    @Inject('SIWE') private readonly siweClient: ClientProxy,
  ) {}

  @Get('hello-user')
  helloUser() {
    return this.userClient.send(
      { cmd: 'hello_user' },
      { message: 'test user' },
    );
  }

  @Get('hello-siwe')
  helloSiwe() {
    return this.siweClient.send(
      { cmd: 'hello_siwe' },
      { message: 'test siwe' },
    );
  }
}
