import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { AuthService } from './auth.service';
import { User } from './user.entity';
import { NotFoundException } from '@nestjs/common/exceptions';


describe('UsersController', () => {
  let controller: UsersController;
  let fakeUsersService: Partial<UsersService>;
  let fakeAuthService: Partial<AuthService>;

  beforeEach(async () => {
    fakeUsersService = {
      async findOne(id: number) {
        return { id, email: ''} as User;
      },
      async findByEmail(email) {
        return { id: 1, email } as User;
      },
      async update(id: number, attrs: Partial<User>) {
        return { id, ...attrs } as User;
      },
      async remove(id: number) {
        return { id, email: ''} as User;
      }
    }
    fakeAuthService = {
      signUp: (email: string, password: string) => {
        return Promise.resolve({ id: 1, email, password } as User)
      },
      signIn: (email: string, password: string) => {
        return Promise.resolve({ id: 1, email, password } as User)
      }
    }
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers:[
        {
          provide: UsersService,
          useValue: fakeUsersService
        },
        {
          provide: AuthService,
          useValue: fakeAuthService
        }
      ]
    }).compile();

    controller = module.get<UsersController>(UsersController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('findUser throws an error if user with given id is not found', async () => {
    fakeUsersService.findOne = () => null;
    await expect(controller.findOne('1')).rejects.toThrow(NotFoundException);
  });
});
