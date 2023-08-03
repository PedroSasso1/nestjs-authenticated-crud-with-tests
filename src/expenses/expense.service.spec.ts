import { Test, TestingModule } from '@nestjs/testing';
import { ExpensesService } from './expense.service';
import { UsersService } from '../users/users.service';
import { UsersModule } from '../users/users.module';
import { validCreateUserDto } from '../../test/mocks/user.mocks';
import { CreateExpenseDto } from './dto/create-expense.dto';
import { v4 as uuidV4 } from 'uuid';
import { UserNotFoundException } from '../users/errors/user-not-found.exception';
import { ExpenseValidationException } from './errors/expense-validation.exception';
import {
  createExpenseDtoMock,
  updateExpenseDtoMock,
} from '../../test/mocks/expenses.mocks';
import { ExpenseNotFoundException } from './errors/expense-not-found.exception';
import { UpdateExpenseDto } from './dto/update-expense.dto';
import { Util } from '../util/util';
import { MailerModule } from '../mailer/mailer.module';
import { ConfigModule } from '@nestjs/config';

describe('ExpensesService', () => {
  let service: ExpensesService;
  let usersService: UsersService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [ConfigModule.forRoot(), UsersModule, MailerModule],
      providers: [ExpensesService],
    }).compile();

    service = module.get<ExpensesService>(ExpensesService);
    usersService = module.get<UsersService>(UsersService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
    expect(usersService).toBeDefined();
  });

  it("should throw user not found on create Expense when user doesn't exist", async () => {
    const createdBy = uuidV4();
    const expenseDto: CreateExpenseDto = {
      createdAt: new Date().toISOString(),
      createdBy,
      description: 'new Expense',
      value: 10.0,
    };
    expect(service.create(expenseDto)).rejects.toThrow(
      new UserNotFoundException(
        `Error on Expenses Service: user not found with id: ${createdBy}`,
      ),
    );
  });

  it('should throw error on create when create Expense dto has invalid props', async () => {
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

    expect(service.create(expenseDto)).rejects.toThrow(
      ExpenseValidationException,
    );
    jest.useRealTimers();
  });

  it('should create a new Expense', async () => {
    const createdBy = await usersService.create(
      Object.create(validCreateUserDto),
    );
    const expenseDto = {
      ...createExpenseDtoMock,
      createdBy,
    };

    const newId = await service.create(expenseDto);
    const createdExpense = service.ExpensesInMemoryTable[0];

    expect(service.ExpensesInMemoryTable).toHaveLength(1);
    expect(newId).toBe(createdExpense.id);
    expect(createdExpense.createdAt.toISOString()).toBe(expenseDto.createdAt);
    expect(createdExpense.createdBy).toBe(expenseDto.createdBy);
    expect(createdExpense.description).toBe(expenseDto.description);
    expect(createdExpense.value).toBe(expenseDto.value);
  });

  it('should find all Expenses', async () => {
    const createdBy = await usersService.create(
      Object.create(validCreateUserDto),
    );
    const expenseDto = {
      ...createExpenseDtoMock,
      createdBy,
    };

    const newId = await service.create(expenseDto);
    const [expense] = await service.findAll(createdBy);

    expect(newId).toBe(expense.id);
    expect(expense.createdAt).toBe(expenseDto.createdAt);
    expect(expense.createdBy).toBe(expenseDto.createdBy);
    expect(expense.description).toBe(expenseDto.description);
    expect(expense.value).toBe(Util.formatNumberToCurrency(expenseDto.value));
  });

  it("should throw error on find one by id when Expense doesn't exist", async () => {
    const notFoundId = uuidV4();
    const createdBy = uuidV4();
    expect(service.findOne(notFoundId, createdBy)).rejects.toThrow(
      new ExpenseNotFoundException(`Expense not found with ID: ${notFoundId}`),
    );
  });

  it('should find Expense by id', async () => {
    const createdBy = await usersService.create(
      Object.create(validCreateUserDto),
    );
    const expenseDto = {
      ...createExpenseDtoMock,
      createdBy,
    };

    const newId = await service.create(expenseDto);
    const expense = await service.findOne(newId, createdBy);

    expect(newId).toBe(expense.id);
    expect(expense.createdAt).toBe(expenseDto.createdAt);
    expect(expense.createdBy).toBe(expenseDto.createdBy);
    expect(expense.description).toBe(expenseDto.description);
    expect(expense.value).toBe(Util.formatNumberToCurrency(expenseDto.value));
  });

  it("should throw error on update when Expense doesn't exists", async () => {
    const updateDto = {
      ...updateExpenseDtoMock,
    };
    const notFoundId = uuidV4();
    const createdBy = uuidV4();

    expect(service.update(notFoundId, updateDto, createdBy)).rejects.toThrow(
      new ExpenseNotFoundException(`Expense not found with ID: ${notFoundId}`),
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

    const newId = await service.create(expenseDto);

    const invalidDesc: any = 0;

    const updateDto: UpdateExpenseDto = {
      description: invalidDesc,
      value: -1,
    };

    expect(service.update(newId, updateDto, createdBy)).rejects.toThrow(
      ExpenseValidationException,
    );
  });

  it('should update Expense', async () => {
    const createdBy = await usersService.create(
      Object.create(validCreateUserDto),
    );
    const expenseDto = {
      ...createExpenseDtoMock,
      createdBy,
    };

    const newId = await service.create(expenseDto);

    const updateDto = {
      ...updateExpenseDtoMock,
    };

    await service.update(newId, updateDto, createdBy);

    const updatedExpense = service.ExpensesInMemoryTable[0];

    expect(service.ExpensesInMemoryTable).toHaveLength(1);
    expect(newId).toBe(updatedExpense.id);
    expect(updatedExpense.createdAt.toISOString()).toBe(expenseDto.createdAt);
    expect(updatedExpense.createdBy).toBe(expenseDto.createdBy);
    expect(updatedExpense.description).toBe(updateDto.description);
    expect(updatedExpense.value).toBe(updateDto.value);
  });

  it("should throw error on remove when Expense doesn't exist", async () => {
    const notFoundId = uuidV4();
    const createdBy = uuidV4();
    expect(service.remove(notFoundId, createdBy)).rejects.toThrow(
      new ExpenseNotFoundException(`Expense not found with ID: ${notFoundId}`),
    );
  });

  it('should remove Expense', async () => {
    const createdBy = await usersService.create(
      Object.create(validCreateUserDto),
    );
    const ExpenseDto = {
      ...createExpenseDtoMock,
      createdBy,
    };

    const newId = await service.create(ExpenseDto);

    await service.remove(newId, createdBy);

    expect(service.ExpensesInMemoryTable).toHaveLength(0);
  });
});
