import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';
import { v4 as uuidV4 } from 'uuid';
import * as bcrypt from 'bcrypt';
import { isEmpty } from 'class-validator';
import { UserValidationException } from '../errors/user-validation-exception';
import { UserExistsException } from '../errors/user-exists-exception';
import { UserNotFoundException } from '../errors/user-not-found-excpetion';

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

      const userByEmail = await this.findOneByEmail(createUserDto.email);

      if (userByEmail) {
        throw new UserExistsException('email is taken');
      }

      this.inMemoryUsersTable.push(user);
      return newId;
    } catch (error) {
      throw new UserValidationException(error.message);
    }
  }

  async findAll() {
    return this.inMemoryUsersTable;
  }

  async findOne(id: string) {
    return this._get(id);
  }

  async findOneByEmail(email: string) {
    const user = this.inMemoryUsersTable.find((item) => item.email === email);
    console.log(user);
    if (!user) {
      return null;
    }
    return user;
  }

  async update(updateUserDto: UpdateUserDto) {
    const { id, email, password } = await this._get(updateUserDto.id);
    let newEmail = email;
    let newPassword = password;

    if (updateUserDto.email && updateUserDto.email !== email) {
      const userByEmail = await this.findOneByEmail(updateUserDto.email);
      if (userByEmail) {
        throw new UserExistsException('email is taken');
      }
      newEmail = updateUserDto.email;
    }

    if (
      updateUserDto.password &&
      !bcrypt.compareSync(updateUserDto.password, password)
    ) {
      newPassword = await this._getHashedPassword(updateUserDto.password);
    }
    console.log(id);
    console.log(newEmail);
    console.log(newPassword);

    const user = new User({
      id,
      email: newEmail,
      password: newPassword,
    });

    const indexFound = this.inMemoryUsersTable.findIndex(
      (i) => i.id === updateUserDto.id,
    );
    this.inMemoryUsersTable[indexFound] = user;
  }

  async remove(id: string) {
    await this._get(id);
    const indexFound = this.inMemoryUsersTable.findIndex((i) => i.id === id);
    this.inMemoryUsersTable.splice(indexFound, 1);
  }

  protected async _get(id: string) {
    const item = this.inMemoryUsersTable.find((item) => item.id === id);
    if (!item) {
      throw new UserNotFoundException(`User not found using ID ${id}`);
    }
    return item;
  }

  protected async _getHashedPassword(password: string) {
    if (isEmpty(password.length)) {
      throw new UserValidationException(
        "Error on User Service - password can't be empty",
      );
    }
    const saltRounds = 10;
    const salt = await bcrypt.genSalt(saltRounds);
    const hash = await bcrypt.hash(password, salt);
    return hash;
  }
}
