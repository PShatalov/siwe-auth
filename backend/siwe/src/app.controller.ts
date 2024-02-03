import { Controller, Get } from '@nestjs/common';
import { EventPattern, MessagePattern } from '@nestjs/microservices';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @MessagePattern({ cmd: 'hello_siwe' })
  getHello(data: any): string {
    console.log('handle message to siwe', JSON.stringify(data));
    return this.appService.getHello();
  }
}
