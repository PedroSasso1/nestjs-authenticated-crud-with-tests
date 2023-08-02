import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';
import { v4 as uuidV4 } from 'uuid';

@Injectable()
export class UsersService {
  items: Partial<User>[] = [];

  async create(createUserDto: CreateUserDto) {
    const newId = uuidV4();
    this.items.push({ ...createUserDto, id: newId });
    return newId;
  }

  async findAll() {
    return this.items;
  }

  async findOne(id: string) {
    return this._get(id);
  }

  async update(updateUserDto: UpdateUserDto) {
    await this._get(updateUserDto.id);
    const indexFound = this.items.findIndex((i) => i.id === updateUserDto.id);
    this.items[indexFound] = updateUserDto;
  }

  async remove(id: string) {
    await this._get(id);
    const indexFound = this.items.findIndex((i) => i.id === id);
    this.items.splice(indexFound, 1);
  }

  protected async _get(id: string) {
    const item = this.items.find((item) => item.id === id);
    if (!item) {
      throw new Error(`User not found using ID ${id}`);
    }
    return item;
  }
}
