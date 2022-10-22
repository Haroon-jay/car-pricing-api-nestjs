import { Test } from '@nestjs/testing';
import { UsersService } from './users.service';
import { AuthService } from './auth.service';
import { NotAcceptableException } from '@nestjs/common';
import { User } from './user.entity';

describe('AuthService', () => {
  let service: AuthService;
  let fakeUsersService: Partial<UsersService>;
  beforeEach(async () => {
    fakeUsersService = {
      find: () => Promise.resolve([]),
      create: (email: string, password: string) =>
        Promise.resolve({ id: 1, email, password } as User),
    };

    const module = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: UsersService,
          useValue: fakeUsersService,
        },
      ],
    }).compile();

     service = module.get<AuthService>(AuthService);
  });
  it('can create an instance of auth service', async () => {
    // create a fake instance of the users service
    expect(service).toBeDefined();
  });

  it('creates a new user with a hashed password', async () => {
    const password = '123456';
    const user = await service.signUp('hello@hello.com', password);
    const [salt, storedHash] = user.password.split('.');
    expect(salt).toBeDefined();
    expect(storedHash).toBeDefined();
    expect(user.password).not.toEqual(password);
  });

  it('throws an error if user signs up with email that is in use', async () => {
    fakeUsersService.find = () => Promise.resolve([{id:1, email:'', password:''}]);
        await expect(service.signUp('','')).rejects.toThrow(NotAcceptableException);
  });

  it('throws if signin is called with an unused email', async () => {
    await expect(service.signIn('','')).rejects.toThrow();
  });

});
