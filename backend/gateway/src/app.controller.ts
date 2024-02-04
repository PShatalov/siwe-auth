import {
  Controller,
  Get,
  Inject,
  Post,
  Body,
  UseGuards,
  Request,
} from '@nestjs/common';
import { ClientProxy, RpcException } from '@nestjs/microservices';
import { AuthGuard } from '@nestjs/passport';
import { lastValueFrom } from 'rxjs';
import { AuthService } from 'src/auth/auth.service';
import { SignInDto } from './dto/sign-in.dto';

@Controller('api/v1')
export class AppController {
  constructor(
    private readonly authService: AuthService,
    @Inject('USER') private readonly userClient: ClientProxy,
    @Inject('SIWE') private readonly siweClient: ClientProxy,
  ) {}

  @Get('nonce')
  getNonce() {
    return this.siweClient.send({ cmd: 'siwe_get_nonce' }, {});
  }

  @UseGuards(AuthGuard('jwt'))
  @Get('user/profile')
  getProtectedResource(@Request() req) {
    const { address } = req.user;
    return this.userClient.send({ cmd: 'user_profile' }, { address });
  }

  @Post('user/signup')
  async signUp(@Body() body) {
    try {
      const { message, signature, username } = body;
      const address = await this.verify({ message, signature });

      const user = await lastValueFrom(
        this.userClient.send({ cmd: 'user_create' }, { address, username }),
      );
      return this.authService.getToken(user);
    } catch (err) {
      throw new RpcException(err);
    }
  }

  @Post('user/signin')
  async signIn(@Body() body: SignInDto) {
    try {
      const address = await this.verify(body);

      const user = await lastValueFrom(
        this.userClient.send({ cmd: 'user_profile' }, { address }),
      );

      return this.authService.getToken(user);
    } catch (err) {
      throw new RpcException(err);
    }
  }

  private async verify(data: {
    message: string;
    signature: string;
  }): Promise<string> {
    return await lastValueFrom(
      this.siweClient.send({ cmd: 'siwe_verify' }, data),
    );
  }
}
