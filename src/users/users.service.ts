import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';
import { v4 as uuidV4 } from 'uuid';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  inMemoryUsersTable: Partial<User>[] = [];

  async create(createUserDto: CreateUserDto) {
    try {
      const newId = uuidV4();
      const hashedPassword = await this._getHashedPassword(
        createUserDto.password,
      );

      const user = new User({
        id: newId,
        email: createUserDto.email,
        password: hashedPassword,
      });

      this.inMemoryUsersTable.push(user);
      return newId;
    } catch (err) {
      throw new Error(err.message);
    }
  }

  async findAll() {
    return this.inMemoryUsersTable;
  }

  async findOne(id: string) {
    return this._get(id);
  }

  async findOneByEmail(email: string) {
    const item = this.inMemoryUsersTable.find((item) => item.email === email);
    if (!item) {
      throw new Error(`User not found using Email ${email}`);
    }
    return item;
  }

  async update(updateUserDto: UpdateUserDto) {
    try {
      const { id, email, password } = await this._get(updateUserDto.id);
      const newEmail = 'email' in updateUserDto ? updateUserDto.email : email;
      const newPassword =
        'password' in updateUserDto
          ? await this._getHashedPassword(updateUserDto.password)
          : password;

      const user = new User({
        id,
        email: newEmail,
        password: newPassword,
      });

      const indexFound = this.inMemoryUsersTable.findIndex(
        (i) => i.id === updateUserDto.id,
      );
      this.inMemoryUsersTable[indexFound] = user;
    } catch (err) {
      throw new Error(err.message);
    }
  }

  async remove(id: string) {
    await this._get(id);
    const indexFound = this.inMemoryUsersTable.findIndex((i) => i.id === id);
    this.inMemoryUsersTable.splice(indexFound, 1);
  }

  protected async _get(id: string) {
    const item = this.inMemoryUsersTable.find((item) => item.id === id);
    if (!item) {
      throw new Error(`User not found using ID ${id}`);
    }
    return item;
  }

  protected async _getHashedPassword(password: string) {
    if (password.length <= 0) {
      throw new Error("Error on User Service - password can't be empty");
    }
    const saltRounds = 10;
    const salt = await bcrypt.genSalt(saltRounds);
    const hash = await bcrypt.hash(password, salt);
    return hash;
  }
}
