import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';
import {
  invalidCreateUserDto,
  validCreateUserDto,
} from '../../test/mocks/user.mocks';
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

  describe('create', () => {
    it('should throw error on create when user has invalid props', async () => {
      expect(() => service.create(invalidCreateUserDto)).rejects.toThrow();
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
  });

  describe('findOne', () => {
    it('should throw error when user not found', async () => {
      const notFoundId = uuidV4();
      expect(() => service.findOne(notFoundId)).rejects.toThrow(
        new Error(`User not found using ID ${notFoundId}`),
      );
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
  });

  describe('findOneByEmail', () => {
    it('should throw error when user not found by email', async () => {
      const notFoundEmail = 'test@email.com';
      expect(() => service.findOneByEmail(notFoundEmail)).rejects.toThrow(
        new Error(`User not found using Email ${notFoundEmail}`),
      );
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
  });

  describe('findAll', () => {
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

  describe('update', () => {
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

    it('should throw error on update when updateDto has invalid password', async () => {
      const newId = await service.create(validCreateUserDto);
      const updatedEntity = {
        id: newId,
        password: '',
      };

      expect(() => service.update(updatedEntity)).rejects.toThrow();
    });

    it('should throw error on update when updateDto has invalid email', async () => {
      const newId = await service.create(validCreateUserDto);
      const updatedEntity = {
        id: newId,
        email: '',
      };

      expect(() => service.update(updatedEntity)).rejects.toThrow();
    });

    it('should update a user', async () => {
      const newId = await service.create(validCreateUserDto);
      const updatedEntity = {
        id: newId,
        name: 'new name',
        password: 'new password',
      };
      await service.update(updatedEntity);

      const user = service.inMemoryUsersTable[0];

      expect(validCreateUserDto.email).toBe(user.email);
      expect(isUUID(user.id, 4)).toBeTruthy();
      expect(
        bcrypt.compareSync(updatedEntity.password, user.password),
      ).toBeTruthy();
    });
  });

  describe('delete', () => {
    it('should throw error on delete when user not found', async () => {
      const notFoundId = uuidV4();
      expect(() => service.remove(notFoundId)).rejects.toThrow(
        new Error(`User not found using ID ${notFoundId}`),
      );
    });

    it('should delete a user', async () => {
      const newId = await service.create(validCreateUserDto);
      await service.remove(newId);
      expect(service.inMemoryUsersTable).toHaveLength(0);
    });
  });
});
