import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from '../user/user.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly userService: UserService,
  ) {}

  async validateUser(address: string): Promise<any> {
    console.log(address, '???????')
    const user = await this.userService.getOneByAddress(address);

    if (!user) {
      console.log(user, address, process.env.DB_PATH, 'HERE USER222?????');
      throw new UnauthorizedException('Unauthorized');
    }

    return user;
  }

  async getToken(user: { username: string; address: string }) {
    return {
      accessToken: this.jwtService.sign(user),
    };
  }
}
