import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Put,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  async create(@Body() createUserDto: CreateUserDto) {
    try {
      return { id: await this.usersService.create(createUserDto) };
    } catch (err) {
      return {
        errorMessage: err.message,
        statusCode: err?.status || 500,
      };
    }
  }

  @Get()
  findAll() {
    return this.usersService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    try {
      return this.usersService.findOne(id);
    } catch (err) {
      return {
        errorMessage: err.message,
        statusCode: err?.status || 500,
      };
    }
  }

  @Get('email/:email')
  findOneByEmail(@Param('email') email: string) {
    try {
      return this.usersService.findOneByEmail(email);
    } catch (err) {
      return {
        errorMessage: err.message,
        statusCode: err?.status || 500,
      };
    }
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    try {
      return this.usersService.update({ ...updateUserDto, id });
    } catch (err) {
      return {
        errorMessage: err.message,
        statusCode: err?.status || 500,
      };
    }
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    try {
      return this.usersService.remove(id);
    } catch (err) {
      return {
        errorMessage: err.message,
        statusCode: err?.status || 500,
      };
    }
  }
}
