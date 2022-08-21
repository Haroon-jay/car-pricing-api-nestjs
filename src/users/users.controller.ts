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
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dtos/create-user.dto';
import { UpdateUserDto } from './dtos/update-user.dto';
import { Serialize } from 'src/interceptors/serialize.interceptor';
import { UserDTO } from './dtos/user.dto';

@Serialize(UserDTO)
@Controller('auth')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post('/signup')
  async createUser(@Body() user: CreateUserDto) {
    return await this.usersService
      .create(user.email, user.password)
      .catch((err) => {
        throw new HttpException(err.message, err.status ||  HttpStatus.BAD_REQUEST);
      });
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
