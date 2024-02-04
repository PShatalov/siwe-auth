import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from 'src/user/user.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly userService: UserService,
  ) {}

  async validateUser(address: string): Promise<any> {
    const user = await this.userService.getOneByddress(address);

    if (!user) {
      return new Error('Unauthorized');
    }

    return user;
  }

  async getToken(user: { username: string; address: string }) {
    return {
      accessToken: this.jwtService.sign(user),
    };
  }
}
