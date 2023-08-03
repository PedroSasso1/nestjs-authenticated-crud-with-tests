import { Controller, Get, Post, Body, Param } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UserNotFoundException } from './errors/user-not-found.exception';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  async create(@Body() createUserDto: CreateUserDto) {
    try {
      return { id: await this.usersService.create(createUserDto) };
    } catch (error) {
      return {
        errorMessage: error.message,
        statusCode: error?.status || 500,
      };
    }
  }

  @Get()
  async findAll() {
    const users = await this.usersService.findAll();
    return users.map((user) => ({ id: user.id, email: user.email }));
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    try {
      const user = await this.usersService.findOne(id);
      if (!user) {
        throw new UserNotFoundException(`User not found with ID: ${id}`);
      }
      return { id: user.id, email: user.email };
    } catch (error) {
      return {
        errorMessage: error.message,
        statusCode: error?.status || 500,
      };
    }
  }

  @Get('email/:email')
  async findOneByEmail(@Param('email') email: string) {
    try {
      const user = await this.usersService.findOneByEmail(email);
      if (!user) {
        throw new UserNotFoundException(`User not found with email: ${email}`);
      }
      return { id: user.id, email: user.email };
    } catch (error) {
      return {
        errorMessage: error.message,
        statusCode: error?.status || 500,
      };
    }
  }
}
