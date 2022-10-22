import {
  Controller,
  Get,
  Post,
  Body,
  HttpException,
  HttpStatus,
  Param,
  Patch,
  Query,
  Delete,
  Session,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dtos/create-user.dto';
import { UpdateUserDto } from './dtos/update-user.dto';
import { Serialize } from 'src/interceptors/serialize.interceptor';
import { UserDTO } from './dtos/user.dto';
import { AuthService } from './auth.service';
import { CurrentUser } from './decorators/current-user.decorator';
import { User } from './user.entity';

@Serialize(UserDTO)
@Controller('auth')

export class UsersController {
  constructor(private readonly usersService: UsersService, private authService:AuthService) {}

  @Get('currentuser')
  async currentUser(@CurrentUser() user:User) {
    return user;
  }
  @Post('signout')
  async signOut(@Session() session: any) {
    session.userId = null;
  }
  @Post('/create')
  async createUser(@Body() user: CreateUserDto,  @Session() session: any) {
    const userRes = await this.authService.signUp(user.email, user.password);
    session.userId = userRes.id;
    return userRes
  }

  @Post('/signin')
  async signIn(@Body() user: CreateUserDto,@Session() session: any) {
    const userRes = await this.authService.signIn(user.email, user.password);
    session.userId = userRes.id;
    return userRes
  }
  @Get('/:id')
  async findOne(@Param('id') id: string) {
    return this.usersService.findOne(parseInt(id)).catch((err) => {
      throw new HttpException(err.message, err.status ||  HttpStatus.BAD_REQUEST);
    });
  }


  @Get()
  async findByEmail(@Query('email') email: string) {
    return this.usersService.findByEmail(email).catch((err) => {
      throw new HttpException(err.message, err.status ||  HttpStatus.BAD_REQUEST);
    });
  }

  @Patch('/:id')
  async updateUser(@Param('id') id: string, @Body() user: UpdateUserDto) {
    return this.usersService.update(parseInt(id), user).catch((err) => {
      throw new HttpException(err.message, err.status ||  HttpStatus.BAD_REQUEST);
    });
  }

  @Delete('/:id')
  async removeUser(@Param('id') id: string) {
    return this.usersService.remove(parseInt(id))
    .catch((err) => {
        console.log(err);
      throw new HttpException(err.message, err.status ||  HttpStatus.BAD_REQUEST);
    });
  }
}
