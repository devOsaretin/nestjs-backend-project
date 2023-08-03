import { Test } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { UsersService } from './users.service';
import { User } from './user.entity';
import {
  BadGatewayException,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';

describe('AuthService', () => {
  let service: AuthService;
  let mockUsersService: Partial<UsersService>;
  const testEmail = 'test@test.com';
  const testPassword = 'testpassword';

  beforeEach(async () => {
    mockUsersService = {
      find: () => Promise.resolve([]),
      create: (email: string, password: string) =>
        Promise.resolve({ id: 1, email, password } as User),
    };
    const module = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: UsersService, useValue: mockUsersService },
      ],
    }).compile();
    service = module.get(AuthService);
  });

  it('can instantiate the auth service class', async () => {
    expect(service).toBeDefined();
  });

  it('creates a new user with a salted and hashed password', async () => {
    const user = await service.signup(testEmail, testPassword);
    expect(user.password).not.toEqual(testPassword);

    const [salt, hash] = user.password.split('.');
    expect(salt).toBeDefined();
    expect(hash).toBeDefined();
  });

  it('throws an error if user signs up with an email already registered', async () => {
    mockUsersService.find = () =>
      Promise.resolve([{ id: 1, email: testEmail, password: testPassword }]);

    expect(
      async () => await service.signup(testEmail, testPassword),
    ).rejects.toThrow(BadRequestException);
  });

  it('throws if signin is called with an unused email', async () => {
    await expect(
      service.signin('testEmail@mail.com', testPassword),
    ).rejects.toThrow(NotFoundException);
  });
});
