import { Test, TestingModule } from '@nestjs/testing';
import { ExpensesController } from './expense.controller';
import { ExpensesService } from './expense.service';
import { UsersModule } from '../users/users.module';
import { UsersService } from '../users/users.service';
import { v4 as uuidV4 } from 'uuid';
import { CreateExpenseDto } from './dto/create-expense.dto';
import { HttpException, HttpStatus } from '@nestjs/common';
import { validCreateUserDto } from '../../test/mocks/user.mocks';
import {
  createExpenseDtoMock,
  updateExpenseDtoMock,
} from '../../test/mocks/expenses.mocks';
import { isUUID } from 'class-validator';
import { UpdateExpenseDto } from './dto/update-expense.dto';
import { AuthModule } from '../auth/auth.module';
import { Util } from '../util/util';
import { MailerModule } from '../mailer/mailer.module';
import { ConfigModule } from '@nestjs/config';

describe('ExpensesController', () => {
  let controller: ExpensesController;
  let usersService: UsersService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [ConfigModule.forRoot(), UsersModule, AuthModule, MailerModule],
      controllers: [ExpensesController],
      providers: [ExpensesService],
    }).compile();

    controller = module.get<ExpensesController>(ExpensesController);
    usersService = module.get<UsersService>(UsersService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
    expect(usersService).toBeDefined();
  });

  it("should throw user not found on create expense when user doesn't exist", async () => {
    const createdBy = uuidV4();
    const expenseDto: CreateExpenseDto = {
      createdAt: new Date().toISOString(),
      createdBy,
      description: 'new expense',
      value: 10.0,
    };
    expect(controller.create(expenseDto)).rejects.toThrow(
      new HttpException(
        `Error on Expenses Service: user not found with id: ${createdBy}`,
        HttpStatus.NOT_FOUND,
      ),
    );
  });

  it('should throw error on create when create expense dto has invalid props', async () => {
    const createdBy = await usersService.create(
      Object.create(validCreateUserDto),
    );
    const invalidDesc: any = 0;
    const now = new Date();
    jest.useFakeTimers();
    const nextYear = now.getFullYear() + 1;
    const future = new Date();
    future.setFullYear(nextYear);
    const expenseDto: CreateExpenseDto = {
      createdAt: future.toISOString(),
      createdBy,
      description: invalidDesc,
      value: -1,
    };

    expect(controller.create(expenseDto)).rejects.toThrow(HttpException);
    jest.useRealTimers();
  });

  it('should create a new expense', async () => {
    const createdBy = await usersService.create(
      Object.create(validCreateUserDto),
    );
    const expenseDto = {
      ...createExpenseDtoMock,
      createdBy,
    };

    const { id } = await controller.create(expenseDto);
    expect(isUUID(id, 4)).toBeTruthy();
  });

  it('should find all expenses', async () => {
    const createdBy = await usersService.create(
      Object.create(validCreateUserDto),
    );
    const expenseDto = {
      ...createExpenseDtoMock,
      createdBy,
    };

    const { id } = await controller.create(expenseDto);
    const [expense, ...rest] = await controller.findAll({
      user: { sub: createdBy },
    });

    expect(id).toBe(expense.id);
    expect(expense.createdAt).toBe(expenseDto.createdAt);
    expect(expense.createdBy).toBe(expenseDto.createdBy);
    expect(expense.description).toBe(expenseDto.description);
    expect(expense.value).toBe(Util.formatNumberToCurrency(expenseDto.value));
    expect(rest).toHaveLength(0);
  });

  it("should throw error on find one by id when expense doesn't exist", async () => {
    const notFoundId = uuidV4();
    const createdBy = uuidV4();

    expect(
      controller.findOne({ user: { sub: createdBy } }, notFoundId),
    ).rejects.toThrow(
      new HttpException(
        `Expense not found with ID: ${notFoundId}`,
        HttpStatus.NOT_FOUND,
      ),
    );
  });

  it('should find expense by id', async () => {
    const createdBy = await usersService.create(
      Object.create(validCreateUserDto),
    );
    const expenseDto = {
      ...createExpenseDtoMock,
      createdBy,
    };

    const { id } = await controller.create(expenseDto);
    const expense = await controller.findOne({ user: { sub: createdBy } }, id);

    expect(id).toBe(expense['id']);
    expect(expense['createdAt']).toBe(expenseDto.createdAt);
    expect(expense['createdBy']).toBe(expenseDto.createdBy);
    expect(expense['description']).toBe(expenseDto.description);
    expect(expense['value']).toBe(
      Util.formatNumberToCurrency(expenseDto.value),
    );
  });

  it("should throw error on update when expense doesn't exists", async () => {
    const updateDto = {
      ...updateExpenseDtoMock,
    };
    const notFoundId = uuidV4();

    expect(
      controller.update({ user: { sub: notFoundId } }, notFoundId, updateDto),
    ).rejects.toThrow(
      new HttpException(
        `Expense not found with ID: ${notFoundId}`,
        HttpStatus.NOT_FOUND,
      ),
    );
  });

  it('should throw error when update dto has invalid params', async () => {
    const createdBy = await usersService.create(
      Object.create(validCreateUserDto),
    );
    const expenseDto = {
      ...createExpenseDtoMock,
      createdBy,
    };

    const { id } = await controller.create(expenseDto);

    const invalidDesc: any = 0;

    const updateDto: UpdateExpenseDto = {
      description: invalidDesc,
      value: -1,
    };

    expect(
      controller.update({ user: { sub: createdBy } }, id, updateDto),
    ).rejects.toThrow(HttpException);
  });

  it('should update expense', async () => {
    const createdBy = await usersService.create(
      Object.create(validCreateUserDto),
    );
    const expenseDto = {
      ...createExpenseDtoMock,
      createdBy,
    };

    const { id } = await controller.create(expenseDto);

    const updateDto = {
      ...updateExpenseDtoMock,
      id,
    };

    await controller.update({ user: { sub: createdBy } }, id, updateDto);
    const updatedExpense = await controller.findOne(
      { user: { sub: createdBy } },
      id,
    );

    expect(id).toBe(updatedExpense['id']);
    expect(updatedExpense['createdAt']).toStrictEqual(expenseDto.createdAt);
    expect(updatedExpense['createdBy']).toBe(expenseDto.createdBy);
    expect(updatedExpense['description']).toBe(updateDto.description);
    expect(updatedExpense['value']).toBe(
      Util.formatNumberToCurrency(updateDto.value),
    );
  });

  it("should throw error on remove when expense doesn't exist", async () => {
    const notFoundId = uuidV4();

    expect(
      controller.remove({ user: { sub: notFoundId } }, notFoundId),
    ).rejects.toThrow(
      new HttpException(
        `Expense not found with ID: ${notFoundId}`,
        HttpStatus.NOT_FOUND,
      ),
    );
  });

  it('should remove expense', async () => {
    const createdBy = await usersService.create(
      Object.create(validCreateUserDto),
    );
    const expenseDto = {
      ...createExpenseDtoMock,
      createdBy,
    };

    const { id } = await controller.create(expenseDto);

    await controller.remove({ user: { sub: createdBy } }, id);

    const expenses = await controller.findAll({ user: { sub: createdBy } });
    expect(expenses).toHaveLength(0);
  });
});
