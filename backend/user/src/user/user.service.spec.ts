import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from './user.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';
import { UserDTO } from './user.dto';

describe('UserService', () => {
  let userService: UserService;
  let userRepository: Repository<User>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        {
          provide: getRepositoryToken(User),
          useClass: Repository,
        },
      ],
    }).compile();

    userService = module.get<UserService>(UserService);
    userRepository = module.get<Repository<User>>(getRepositoryToken(User));
  });

  describe('addNew', () => {
    it('should create a new user', async () => {
      const userDTO: UserDTO = {
        username: 'testuser',
        address: 'testaddress',
      };

      const saveMock = jest.fn().mockReturnValue(userDTO);
      userRepository.create = jest.fn().mockReturnValue(userDTO);
      userRepository.save = saveMock;

      const result = await userService.addNew(userDTO);

      expect(userRepository.create).toHaveBeenCalledWith(userDTO);
      expect(saveMock).toHaveBeenCalledWith(userDTO);
      expect(result).toEqual(userDTO);
    });
  });

  describe('getOneByAddress', () => {
    it('should return a user by address', async () => {
      const user: User = {
        id: 1,
        username: 'testuser',
        address: 'testaddress',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      userRepository.findOneOrFail = jest.fn().mockResolvedValue(user);

      const result = await userService.getOneByAddress('testaddress');

      expect(userRepository.findOneOrFail).toHaveBeenCalledWith({
        where: { address: 'testaddress' },
      });
      expect(result).toEqual(user);
    });

    it('should throw an error if user is not found', async () => {
      userRepository.findOneOrFail = jest.fn().mockRejectedValue(new Error('User not found'));

      await expect(userService.getOneByAddress('nonexistentaddress')).rejects.toThrowError('User not found');
    });
  });
});
