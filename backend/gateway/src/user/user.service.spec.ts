import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from './user.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { User } from './user.entity';
import { Repository } from 'typeorm';

describe('UserService', () => {
  let service: UserService;
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

    service = module.get<UserService>(UserService);
    userRepository = module.get<Repository<User>>(getRepositoryToken(User));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getOneByAddress', () => {
    it('should return a user by address', async () => {
      const mockUser = new User();
      mockUser.address = 'example_address';

      jest.spyOn(userRepository, 'findOne').mockResolvedValue(mockUser);

      const address = 'example_address';
      const result = await service.getOneByAddress(address);

      expect(result).toEqual(mockUser);
    });

    it('should return undefined if no user is found', async () => {
      jest.spyOn(userRepository, 'findOne').mockResolvedValue(undefined);

      const address = 'non_existent_address';
      const result = await service.getOneByAddress(address);

      expect(result).toBeUndefined();
    });
  });
});
