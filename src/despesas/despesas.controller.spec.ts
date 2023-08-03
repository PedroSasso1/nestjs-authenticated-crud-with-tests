import { Test, TestingModule } from '@nestjs/testing';
import { DespesasController } from './despesas.controller';
import { DespesasService } from './despesas.service';
import { UsersModule } from '../users/users.module';
import { UsersService } from '../users/users.service';
import { v4 as uuidV4 } from 'uuid';
import { CreateDespesaDto } from './dto/create-despesa.dto';
import { HttpException, HttpStatus } from '@nestjs/common';
import { validCreateUserDto } from '../../test/mocks/user.mocks';
import {
  createDespesaDtoMock,
  updateDespesaDtoMock,
} from '../../test/mocks/despesas.mocks';
import { isUUID } from 'class-validator';
import { UpdateDespesaDto } from './dto/update-despesa.dto';
import { AuthModule } from '../auth/auth.module';
import { Util } from '../util/util';
import { MailerModule } from '../mailer/mailer.module';
import { ConfigModule } from '@nestjs/config';

describe('DespesasController', () => {
  let controller: DespesasController;
  let usersService: UsersService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [ConfigModule.forRoot(), UsersModule, AuthModule, MailerModule],
      controllers: [DespesasController],
      providers: [DespesasService],
    }).compile();

    controller = module.get<DespesasController>(DespesasController);
    usersService = module.get<UsersService>(UsersService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
    expect(usersService).toBeDefined();
  });

  it("should throw user not found on create despesa when user doesn't exist", async () => {
    const createdBy = uuidV4();
    const despesaDto: CreateDespesaDto = {
      createdAt: new Date().toISOString(),
      createdBy,
      description: 'new despesa',
      value: 10.0,
    };
    expect(controller.create(despesaDto)).rejects.toThrow(
      new HttpException(
        `Error on Despesas Service: user not found with id: ${createdBy}`,
        HttpStatus.NOT_FOUND,
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
      createdAt: future.toISOString(),
      createdBy,
      description: invalidDesc,
      value: -1,
    };

    expect(controller.create(despesaDto)).rejects.toThrow(HttpException);
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

    const { id } = await controller.create(despesaDto);
    expect(isUUID(id, 4)).toBeTruthy();
  });

  it('should find all despesas', async () => {
    const createdBy = await usersService.create(
      Object.create(validCreateUserDto),
    );
    const despesaDto = {
      ...createDespesaDtoMock,
      createdBy,
    };

    const { id } = await controller.create(despesaDto);
    const [despesa, ...rest] = await controller.findAll({
      user: { sub: createdBy },
    });

    expect(id).toBe(despesa.id);
    expect(despesa.createdAt).toBe(despesaDto.createdAt);
    expect(despesa.createdBy).toBe(despesaDto.createdBy);
    expect(despesa.description).toBe(despesaDto.description);
    expect(despesa.value).toBe(Util.formatNumberToCurrency(despesaDto.value));
    expect(rest).toHaveLength(0);
  });

  it("should throw error on find one by id when despesa doesn't exist", async () => {
    const notFoundId = uuidV4();
    const createdBy = uuidV4();

    expect(
      controller.findOne({ user: { sub: createdBy } }, notFoundId),
    ).rejects.toThrow(
      new HttpException(
        `Despesa not found with ID: ${notFoundId}`,
        HttpStatus.NOT_FOUND,
      ),
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

    const { id } = await controller.create(despesaDto);
    const despesa = await controller.findOne({ user: { sub: createdBy } }, id);

    expect(id).toBe(despesa['id']);
    expect(despesa['createdAt']).toBe(despesaDto.createdAt);
    expect(despesa['createdBy']).toBe(despesaDto.createdBy);
    expect(despesa['description']).toBe(despesaDto.description);
    expect(despesa['value']).toBe(
      Util.formatNumberToCurrency(despesaDto.value),
    );
  });

  it("should throw error on update when despesa doesn't exists", async () => {
    const updateDto = {
      ...updateDespesaDtoMock,
    };
    const notFoundId = uuidV4();

    expect(
      controller.update({ user: { sub: notFoundId } }, notFoundId, updateDto),
    ).rejects.toThrow(
      new HttpException(
        `Despesa not found with ID: ${notFoundId}`,
        HttpStatus.NOT_FOUND,
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

    const { id } = await controller.create(despesaDto);

    const invalidDesc: any = 0;

    const updateDto: UpdateDespesaDto = {
      description: invalidDesc,
      value: -1,
    };

    expect(
      controller.update({ user: { sub: createdBy } }, id, updateDto),
    ).rejects.toThrow(HttpException);
  });

  it('should update despesa', async () => {
    const createdBy = await usersService.create(
      Object.create(validCreateUserDto),
    );
    const despesaDto = {
      ...createDespesaDtoMock,
      createdBy,
    };

    const { id } = await controller.create(despesaDto);

    const updateDto = {
      ...updateDespesaDtoMock,
      id,
    };

    await controller.update({ user: { sub: createdBy } }, id, updateDto);
    const updatedDespesa = await controller.findOne(
      { user: { sub: createdBy } },
      id,
    );

    expect(id).toBe(updatedDespesa['id']);
    expect(updatedDespesa['createdAt']).toStrictEqual(despesaDto.createdAt);
    expect(updatedDespesa['createdBy']).toBe(despesaDto.createdBy);
    expect(updatedDespesa['description']).toBe(updateDto.description);
    expect(updatedDespesa['value']).toBe(
      Util.formatNumberToCurrency(updateDto.value),
    );
  });

  it("should throw error on remove when despesa doesn't exist", async () => {
    const notFoundId = uuidV4();

    expect(
      controller.remove({ user: { sub: notFoundId } }, notFoundId),
    ).rejects.toThrow(
      new HttpException(
        `Despesa not found with ID: ${notFoundId}`,
        HttpStatus.NOT_FOUND,
      ),
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

    const { id } = await controller.create(despesaDto);

    await controller.remove({ user: { sub: createdBy } }, id);

    const despesas = await controller.findAll({ user: { sub: createdBy } });
    expect(despesas).toHaveLength(0);
  });
});
