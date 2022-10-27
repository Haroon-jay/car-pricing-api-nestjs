import { Test } from '@nestjs/testing';
import { UsersService } from './users.service';
import { AuthService } from './auth.service';
import { NotAcceptableException, BadRequestException, NotFoundException } from '@nestjs/common';
import { User } from './user.entity';

describe('AuthService', () => {
  let service: AuthService;
  let fakeUsersService: Partial<UsersService>;
  beforeEach(async () => {
    const users:User[] = [];

    fakeUsersService = {
      findByEmail: email => {
        return Promise.resolve(users.find(user => user.email === email));
      },
      create: (email, password) => {
        const user = new User();
        user.email = email;
        user.password = password;
        users.push(user);
        return Promise.resolve(user);
      }
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
    await service.signUp('asdf@asdf.com', 'asdf');
    await expect(service.signUp('asdf@asdf.com', 'asdf')).rejects.toThrow(
      BadRequestException,
    );
  });
 
  it('throws if signIn is called with an unused email', async () => {
    await expect(
      service.signIn('asdflkj@asdlfkj.com', 'passdflkj'),
    ).rejects.toThrow(NotFoundException);
  });
 
  it('throws if an invalid password is provided', async () => {
    await service.signUp('laskdjf@alskdfj.com', 'password');
    await expect(
      service.signIn('laskdjf@alskdfj.com', 'laksdlfkj'),
    ).rejects.toThrow(BadRequestException);
  });

    it('returns a user if correct password is provided', async () => {
       await service.signUp('test','123');
       const user = await service.signIn('test','123');
       expect(user).toBeDefined();
    })

});
