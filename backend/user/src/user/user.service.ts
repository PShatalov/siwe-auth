import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { User } from './user.entity';
import { UserDTO } from './user.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
  ) {}

  async addNew(user: UserDTO): Promise<User> {
    const newUser = this.userRepository.create(user);

    return await this.userRepository.save(newUser);
  }

  async getOneByddress(address: string): Promise<User> {
    return this.userRepository.findOneOrFail({ where: { address } });
  }
}
