import { Test, TestingModule } from '@nestjs/testing';
import { UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { AuthService } from './auth.service';
import { UserService } from '../user/user.service';

describe('AuthService', () => {
  let authService: AuthService;
  let userService: UserService;
  let jwtService: JwtService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: UserService,
          useValue: {
            getOneByAddress: jest.fn(),
          },
        },
        {
          provide: JwtService,
          useValue: {
            sign: jest.fn(),
          },
        },
      ],
    }).compile();

    authService = module.get<AuthService>(AuthService);
    userService = module.get<UserService>(UserService);
    jwtService = module.get<JwtService>(JwtService);
  });

  describe('validateUser', () => {
    it('should return a user if found', async () => {
      const address = 'testAddress';
      const user = { username: 'testUser', address };
      userService.getOneByAddress = jest.fn().mockResolvedValue(user);

      const result = await authService.validateUser(address);

      expect(result).toEqual(user);
    });

    it('should throw UnauthorizedException if user is not found', async () => {
      const address = 'nonExistentAddress';
      userService.getOneByAddress = jest.fn().mockResolvedValue(undefined);

      await expect(authService.validateUser(address)).rejects.toThrowError(
        UnauthorizedException,
      );
    });
  });

  describe('getToken', () => {
    it('should return an access token', async () => {
      const user = { username: 'testUser', address: 'testAddress' };
      const token = 'testToken';
      jwtService.sign = jest.fn().mockReturnValue(token);

      const result = await authService.getToken(user);

      expect(result.accessToken).toEqual(token);
    });
  });
});
