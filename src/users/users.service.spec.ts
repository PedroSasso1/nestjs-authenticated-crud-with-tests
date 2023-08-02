import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { validCreateUserDto } from '../../test/mocks/user.mocks';
import { UpdateUserDto } from './dto/update-user.dto';
import { v4 as uuidV4 } from 'uuid';
import { isUUID } from 'class-validator';

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
    expect(service.items[0]).toStrictEqual({ ...createUserDto, id: newId });
    expect(isUUID(newId, 4)).toBeTruthy();
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
    const foundEntity = await service.findOne(newId);
    expect({ ...createUserDto, id: newId }).toStrictEqual(foundEntity);
  });

  it('should find all users', async () => {
    const createUserDto: CreateUserDto = validCreateUserDto;
    const newId = await service.create(createUserDto);
    const users = await service.findAll();
    expect(users).toStrictEqual([{ ...createUserDto, id: newId }]);
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
    expect(updatedEntity).toStrictEqual(service.items[0]);
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
    expect(service.items).toHaveLength(0);
  });
});
