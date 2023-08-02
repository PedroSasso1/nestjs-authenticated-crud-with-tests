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
    const newId = uuidV4();
    const hashedPassword = await this._getHashedPassword(
      createUserDto.password,
    );

    this.inMemoryUsersTable.push({
      ...createUserDto,
      id: newId,
      password: hashedPassword,
    });
    return newId;
  }

  async findAll() {
    return this.inMemoryUsersTable;
  }

  async findOne(id: string) {
    return this._get(id);
  }

  async update(updateUserDto: UpdateUserDto) {
    await this._get(updateUserDto.id);
    const indexFound = this.inMemoryUsersTable.findIndex(
      (i) => i.id === updateUserDto.id,
    );
    this.inMemoryUsersTable[indexFound] = updateUserDto;
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
    const saltRounds = 10;
    const salt = await bcrypt.genSalt(saltRounds);
    const hash = await bcrypt.hash(password, salt);
    return hash;
  }
}
