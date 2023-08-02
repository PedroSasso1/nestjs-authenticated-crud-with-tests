import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { validCreateUserDto } from '../../test/mocks/user.mocks';
import { UpdateUserDto } from './dto/update-user.dto';
import { v4 as uuidV4 } from 'uuid';
import { isUUID } from 'class-validator';
import * as bcrypt from 'bcrypt';

describe('UsersService', () => {
  let service: UsersService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [UsersService],
    }).compile();

    service = module.get<UsersService>(UsersService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should create a new user', async () => {
    const createUserDto: CreateUserDto = validCreateUserDto;
    const newId = await service.create(createUserDto);
    const user = service.inMemoryUsersTable[0];

    expect(createUserDto.email).toBe(user.email);
    expect(isUUID(newId, 4)).toBeTruthy();
    expect(
      bcrypt.compareSync(createUserDto.password, user.password),
    ).toBeTruthy();
  });

  it('should throw error when user not found', async () => {
    const notFoundId = uuidV4();
    expect(() => service.findOne(notFoundId)).rejects.toThrow(
      new Error(`User not found using ID ${notFoundId}`),
    );
  });

  it('should find a user by id', async () => {
    const createUserDto: CreateUserDto = validCreateUserDto;
    const newId = await service.create(createUserDto);
    const foundUser = await service.findOne(newId);

    expect(createUserDto.email).toBe(foundUser.email);
    expect(isUUID(newId, 4)).toBeTruthy();
    expect(
      bcrypt.compareSync(createUserDto.password, foundUser.password),
    ).toBeTruthy();
  });

  it('should find all users', async () => {
    const createUserDto: CreateUserDto = validCreateUserDto;
    const newId = await service.create(createUserDto);
    const users = await service.findAll();
    const [foundUser] = users;

    expect(createUserDto.email).toBe(foundUser.email);
    expect(isUUID(newId, 4)).toBeTruthy();
    expect(
      bcrypt.compareSync(createUserDto.password, foundUser.password),
    ).toBeTruthy();
  });

  it('should throw error on update when user not found', async () => {
    const notFoundId = uuidV4();
    const createUserDto: UpdateUserDto = {
      ...validCreateUserDto,
      id: notFoundId,
    };
    expect(() => service.update(createUserDto)).rejects.toThrow(
      new Error(`User not found using ID ${notFoundId}`),
    );
  });

  it('should update a user', async () => {
    const createUserDto: CreateUserDto = validCreateUserDto;
    const newId = await service.create(createUserDto);
    const updatedEntity = {
      id: newId,
      name: 'new name',
      password: 'new password',
    };
    await service.update(updatedEntity);
    expect(updatedEntity).toStrictEqual(service.inMemoryUsersTable[0]);
  });

  it('should throw error on delete when user not found', async () => {
    const notFoundId = uuidV4();
    expect(() => service.remove(notFoundId)).rejects.toThrow(
      new Error(`User not found using ID ${notFoundId}`),
    );
  });

  it('should delete a user', async () => {
    const createUserDto: CreateUserDto = validCreateUserDto;
    const newId = await service.create(createUserDto);
    await service.remove(newId);
    expect(service.inMemoryUsersTable).toHaveLength(0);
  });
});
