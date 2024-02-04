import { Controller } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { User } from './user/user.entity';
import { UserService } from './user/user.service';

@Controller()
export class AppController {
  constructor(private readonly userService: UserService) {}

  @MessagePattern({ cmd: 'user_create' })
  async createUser(data: { username: string; address: string }): Promise<User> {
    const { username, address } = data;

    return await this.userService.addNew({
      username,
      address,
    });
  }

  @MessagePattern({ cmd: 'user_profile' })
  async getUser(data: { address: string }): Promise<User> {
    const { address } = data;
    return await this.userService.getOneByddress(address);
  }
}
