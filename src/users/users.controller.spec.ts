import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import {
  invalidCreateUserDto,
  validCreateUserDto,
} from '../../test/mocks/user.mocks';
import { isUUID } from 'class-validator';
import { v4 as uuidV4 } from 'uuid';
import { HttpException, HttpStatus } from '@nestjs/common';

describe('UsersController', () => {
  let controller: UsersController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [UsersService],
    }).compile();

    controller = module.get<UsersController>(UsersController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should return error on create when user has invalid props', async () => {
    expect(controller.create(invalidCreateUserDto)).rejects.toThrow(
      HttpException,
    );
  });
  it('should create a new user', async () => {
    const { id } = await controller.create(validCreateUserDto);
    expect(isUUID(id, 4)).toBeTruthy();
  });

  it('should return error on create when creating a new user with existent email', async () => {
    await controller.create(validCreateUserDto);
    expect(controller.create(validCreateUserDto)).rejects.toThrow(
      new HttpException('email is taken', HttpStatus.CONFLICT),
    );
  });

  it('should return error on find by id when user not found', async () => {
    const notFoundId = uuidV4();
    expect(controller.findOne(notFoundId)).rejects.toThrow(
      new HttpException(
        `User not found with ID: ${notFoundId}`,
        HttpStatus.NOT_FOUND,
      ),
    );
  });

  it('should find a user by id', async () => {
    const { id } = await controller.create(validCreateUserDto);
    const foundUser = await controller.findOne(id);

    expect(validCreateUserDto.email).toBe(foundUser.email);
    expect(id).toBe(foundUser.id);
    expect(isUUID(foundUser.id, 4)).toBeTruthy();
  });

  it('should throw error on find by email when user not found', async () => {
    const notFoundEmail = 'test@email.com';
    expect(controller.findOneByEmail(notFoundEmail)).rejects.toThrow(
      new HttpException(
        `User not found with email: ${notFoundEmail}`,
        HttpStatus.NOT_FOUND,
      ),
    );
  });

  it('should find a user by email', async () => {
    const { id } = await controller.create(validCreateUserDto);
    const foundUser = await controller.findOneByEmail(validCreateUserDto.email);

    expect(validCreateUserDto.email).toBe(foundUser.email);
    expect(id).toBe(foundUser.id);
    expect(isUUID(foundUser.id, 4)).toBeTruthy();
  });

  it('should find all users', async () => {
    const { id } = await controller.create(validCreateUserDto);
    const users = await controller.findAll();
    const [foundUser] = users;

    expect(validCreateUserDto.email).toBe(foundUser.email);
    expect(id).toBe(foundUser.id);
    expect(isUUID(foundUser.id, 4)).toBeTruthy();
  });
});
