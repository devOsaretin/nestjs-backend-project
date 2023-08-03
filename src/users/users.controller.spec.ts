import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from './users.controller';
import { AuthService } from './auth.service';
import { UsersService } from './users.service';
import { NotFoundException } from '@nestjs/common';

describe('UsersController', () => {
  let controller: UsersController;
  let mockUsersService: Partial<UsersService>;
  let mockAuthService: Partial<AuthService>;
  const testEmail = 'test@test.com';
  const testPassword = 'testpassword';

  beforeEach(async () => {
    mockAuthService = {
      signin(email: string, password: string) {
        return Promise.resolve({
          id: 1,
          email: testEmail,
          password: testPassword,
        });
      },
    };
    mockUsersService = {
      findOne: (id: number) => {
        return Promise.resolve({
          id,
          email: testEmail,
          password: testPassword,
        });
      },

      find: (email: string) => {
        return Promise.resolve([{ id: 1, email, password: testPassword }]);
      },
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [
        {
          provide: UsersService,
          useValue: mockUsersService,
        },
        {
          provide: AuthService,
          useValue: mockAuthService,
        },
      ],
    }).compile();

    controller = module.get<UsersController>(UsersController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should be able to get a user with the id provided', async () => {
    const users = await controller.findUser('1');
    expect(users).toBeDefined();
  });

  it('throws an error if user with given id is not found', async () => {
    mockUsersService.findOne = () => null;
    expect(async () => await controller.findUser('1')).rejects.toThrow(
      NotFoundException,
    );
  });

  it('signin, updates session and return the user', async () => {
    const session = {
      userId: 0,
    };
    const user = await controller.signin(
      { email: testEmail, password: testPassword },
      session,
    );

    expect(user.id).toEqual(1);
    expect(session.userId).toEqual(1);
  });
});
