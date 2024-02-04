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
    const userObj = await this.userRepository.save(newUser);
    console.log(
      process.env.DB_PATH,
      user.address,
      await this.userRepository.findOne({
        where: { address: user.address },
      }),
    );
    return userObj;
  }

  async getOneByAddress(address: string): Promise<User> {
    return this.userRepository.findOneOrFail({ where: { address } });
  }
}
