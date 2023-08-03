import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';
import {
  invalidCreateUserDto,
  validCreateUserDto,
} from '../../test/mocks/user.mocks';
import { v4 as uuidV4 } from 'uuid';
import { isUUID } from 'class-validator';
import * as bcrypt from 'bcrypt';
import { UserValidationException } from './errors/user-validation.exception';
import { UserExistsException } from './errors/user-exists.exception';

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

  it('should throw error on create when user has invalid props', async () => {
    expect(() => service.create(invalidCreateUserDto)).rejects.toThrow(
      UserValidationException,
    );
  });
  it('should create a new user', async () => {
    const newId = await service.create(validCreateUserDto);
    const user = service.inMemoryUsersTable[0];

    expect(validCreateUserDto.email).toBe(user.email);
    expect(isUUID(newId, 4)).toBeTruthy();
    expect(
      bcrypt.compareSync(validCreateUserDto.password, user.password),
    ).toBeTruthy();
  });

  it('should throw error on create when creating a new user with existent email', async () => {
    await service.create(validCreateUserDto);
    expect(service.create(validCreateUserDto)).rejects.toThrow(
      UserExistsException,
    );
  });

  it('should throw error on find by id when user not found', async () => {
    const notFoundId = uuidV4();
    const user = await service.findOne(notFoundId);
    expect(user).toBeNull();
  });

  it('should find a user by id', async () => {
    const newId = await service.create(validCreateUserDto);
    const foundUser = await service.findOne(newId);

    expect(validCreateUserDto.email).toBe(foundUser.email);
    expect(isUUID(newId, 4)).toBeTruthy();
    expect(
      bcrypt.compareSync(validCreateUserDto.password, foundUser.password),
    ).toBeTruthy();
  });

  it('should throw error on find by email when user not found', async () => {
    const notFoundEmail = 'test@email.com';
    const user = await service.findOneByEmail(notFoundEmail);
    expect(user).toBeNull();
  });

  it('should find a user by email', async () => {
    const newId = await service.create(validCreateUserDto);
    const foundUser = await service.findOneByEmail(validCreateUserDto.email);

    expect(validCreateUserDto.email).toBe(foundUser.email);
    expect(isUUID(newId, 4)).toBeTruthy();
    expect(
      bcrypt.compareSync(validCreateUserDto.password, foundUser.password),
    ).toBeTruthy();
  });

  it('should find all users', async () => {
    const newId = await service.create(validCreateUserDto);
    const users = await service.findAll();
    const [foundUser] = users;

    expect(validCreateUserDto.email).toBe(foundUser.email);
    expect(isUUID(newId, 4)).toBeTruthy();
    expect(
      bcrypt.compareSync(validCreateUserDto.password, foundUser.password),
    ).toBeTruthy();
  });
});
