import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { User } from './entities/user.entity';
import { v4 as uuidV4 } from 'uuid';
import * as bcrypt from 'bcrypt';
import { UserExistsException } from '../errors/user-exists-exception';

@Injectable()
export class UsersService {
  inMemoryUsersTable: Partial<User>[] = [];

  async create(createUserDto: CreateUserDto) {
    const newId = uuidV4();
    const user = new User({
      id: newId,
      email: createUserDto.email,
      password: createUserDto.password,
    });

    const hashedPassword = await this._getHashedPassword(
      createUserDto.password,
    );
    user.password = hashedPassword;

    const userByEmail = await this.findOneByEmail(createUserDto.email);

    if (userByEmail) {
      throw new UserExistsException('email is taken');
    }

    this.inMemoryUsersTable.push(user);
    return newId;
  }

  async findAll() {
    return this.inMemoryUsersTable;
  }

  async findOne(id: string) {
    const user = this.inMemoryUsersTable.find((item) => item.id === id);
    if (!user) {
      return null;
    }
    return user;
  }

  async findOneByEmail(email: string) {
    const user = this.inMemoryUsersTable.find((item) => item.email === email);
    if (!user) {
      return null;
    }
    return user;
  }

  protected async _getHashedPassword(password: string) {
    const saltRounds = 10;
    const salt = await bcrypt.genSalt(saltRounds);
    const hash = await bcrypt.hash(password, salt);
    return hash;
  }
}
