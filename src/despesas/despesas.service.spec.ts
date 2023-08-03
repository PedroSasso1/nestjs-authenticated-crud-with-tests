import { Test, TestingModule } from '@nestjs/testing';
import { DespesasService } from './despesas.service';
import { UsersService } from '../users/users.service';
import { UsersModule } from '../users/users.module';
import { validCreateUserDto } from '../../test/mocks/user.mocks';
import { CreateDespesaDto } from './dto/create-despesa.dto';
import { v4 as uuidV4 } from 'uuid';
import { UserNotFoundException } from '../users/errors/user-not-found.exception';
import { DespesasValidationException } from './errors/despesas-validation.exception';
import {
  createDespesaDtoMock,
  updateDespesaDtoMock,
} from '../../test/mocks/despesas.mocks';
import { DespesaNotFoundException } from './errors/despesa-not-found.exception';
import { UpdateDespesaDto } from './dto/update-despesa.dto';

describe('DespesasService', () => {
  let service: DespesasService;
  let usersService: UsersService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [UsersModule],
      providers: [DespesasService],
    }).compile();

    service = module.get<DespesasService>(DespesasService);
    usersService = module.get<UsersService>(UsersService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
    expect(usersService).toBeDefined();
  });

  it("should throw user not found on create despesa when user doesn't exist", async () => {
    const createdBy = uuidV4();
    const despesaDto: CreateDespesaDto = {
      createdAt: new Date(),
      createdBy,
      description: 'new despesa',
      value: 10.0,
    };
    expect(service.create(despesaDto)).rejects.toThrow(
      new UserNotFoundException(
        `Error on Despesas Service: user not found with id: ${createdBy}`,
      ),
    );
  });

  it('should throw error on create when create despesa dto has invalid props', async () => {
    const createdBy = await usersService.create(
      Object.create(validCreateUserDto),
    );
    const invalidDesc: any = 0;
    const now = new Date();
    jest.useFakeTimers();
    const nextYear = now.getFullYear() + 1;
    const future = new Date();
    future.setFullYear(nextYear);
    const despesaDto: CreateDespesaDto = {
      createdAt: future,
      createdBy,
      description: invalidDesc,
      value: -1,
    };

    expect(service.create(despesaDto)).rejects.toThrow(
      DespesasValidationException,
    );
    jest.useRealTimers();
  });

  it('should create a new despesa', async () => {
    const createdBy = await usersService.create(
      Object.create(validCreateUserDto),
    );
    const despesaDto = {
      ...createDespesaDtoMock,
      createdBy,
    };

    const newId = await service.create(despesaDto);
    const createdDespesa = service.despesasInMemoryTable[0];

    expect(service.despesasInMemoryTable).toHaveLength(1);
    expect(newId).toBe(createdDespesa.id);
    expect(createdDespesa.createdAt).toBe(despesaDto.createdAt);
    expect(createdDespesa.createdBy).toBe(despesaDto.createdBy);
    expect(createdDespesa.description).toBe(despesaDto.description);
    expect(createdDespesa.value).toBe(despesaDto.value);
  });

  it('should find all despesas', async () => {
    const createdBy = await usersService.create(
      Object.create(validCreateUserDto),
    );
    const despesaDto = {
      ...createDespesaDtoMock,
      createdBy,
    };

    const newId = await service.create(despesaDto);
    const [despesa] = await service.findAll();

    expect(newId).toBe(despesa.id);
    expect(despesa.createdAt).toBe(despesaDto.createdAt);
    expect(despesa.createdBy).toBe(despesaDto.createdBy);
    expect(despesa.description).toBe(despesaDto.description);
    expect(despesa.value).toBe(despesaDto.value);
  });

  it("should throw error on find one by id when despesa doesn't exist", async () => {
    const notFoundId = uuidV4();
    expect(service.findOne(notFoundId)).rejects.toThrow(
      new DespesaNotFoundException(`Despesa not found with ID: ${notFoundId}`),
    );
  });

  it('should find despesa by id', async () => {
    const createdBy = await usersService.create(
      Object.create(validCreateUserDto),
    );
    const despesaDto = {
      ...createDespesaDtoMock,
      createdBy,
    };

    const newId = await service.create(despesaDto);
    const despesa = await service.findOne(newId);

    expect(newId).toBe(despesa.id);
    expect(despesa.createdAt).toBe(despesaDto.createdAt);
    expect(despesa.createdBy).toBe(despesaDto.createdBy);
    expect(despesa.description).toBe(despesaDto.description);
    expect(despesa.value).toBe(despesaDto.value);
  });

  it("should throw error on update when despesa doesn't exists", async () => {
    const updateDto = {
      ...updateDespesaDtoMock,
    };
    expect(service.update(updateDto)).rejects.toThrow(
      new DespesaNotFoundException(
        `Despesa not found with ID: ${updateDto.id}`,
      ),
    );
  });

  it('should throw error when update dto has invalid params', async () => {
    const createdBy = await usersService.create(
      Object.create(validCreateUserDto),
    );
    const despesaDto = {
      ...createDespesaDtoMock,
      createdBy,
    };

    const newId = await service.create(despesaDto);

    const invalidDesc: any = 0;

    const updateDto: UpdateDespesaDto = {
      id: newId,
      description: invalidDesc,
      value: -1,
    };

    expect(service.update(updateDto)).rejects.toThrow(
      DespesasValidationException,
    );
  });

  it('should update despesa', async () => {
    const createdBy = await usersService.create(
      Object.create(validCreateUserDto),
    );
    const despesaDto = {
      ...createDespesaDtoMock,
      createdBy,
    };

    const newId = await service.create(despesaDto);

    const updateDto = {
      ...updateDespesaDtoMock,
      id: newId,
    };

    await service.update(updateDto);

    const updatedDespesa = service.despesasInMemoryTable[0];

    expect(service.despesasInMemoryTable).toHaveLength(1);
    expect(newId).toBe(updatedDespesa.id);
    expect(updatedDespesa.createdAt).toStrictEqual(despesaDto.createdAt);
    expect(updatedDespesa.createdBy).toBe(despesaDto.createdBy);
    expect(updatedDespesa.description).toBe(updateDto.description);
    expect(updatedDespesa.value).toBe(updateDto.value);
  });

  it("should throw error on remove when despesa doesn't exist", async () => {
    const notFoundId = uuidV4();
    expect(service.remove(notFoundId)).rejects.toThrow(
      new DespesaNotFoundException(`Despesa not found with ID: ${notFoundId}`),
    );
  });

  it('should remove despesa', async () => {
    const createdBy = await usersService.create(
      Object.create(validCreateUserDto),
    );
    const despesaDto = {
      ...createDespesaDtoMock,
      createdBy,
    };

    const newId = await service.create(despesaDto);

    await service.remove(newId);

    expect(service.despesasInMemoryTable).toHaveLength(0);
  });
});
