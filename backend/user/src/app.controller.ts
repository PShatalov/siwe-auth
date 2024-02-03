import { Controller, Get } from '@nestjs/common';
import { EventPattern, MessagePattern } from '@nestjs/microservices';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @MessagePattern({ cmd: 'hello_user' })
  getHello(data: any): string {
    console.log('hello_user event handled', JSON.stringify(data));
    return 'Hello from user';
  }
}
