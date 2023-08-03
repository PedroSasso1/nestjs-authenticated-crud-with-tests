import { CreateExpenseDto } from 'src/expenses/dto/create-expense.dto';
import { ExpenseProps } from '../../src/expenses/entities/expense.entity';
import { v4 as uuidV4 } from 'uuid';
import { UpdateExpenseDto } from 'src/expenses/dto/update-expense.dto';

export const validExpenseMock: ExpenseProps = {
  id: uuidV4(),
  description: 'Expense description',
  createdAt: new Date(),
  createdBy: uuidV4(),
  value: 10,
};

export const createExpenseDtoMock: CreateExpenseDto = {
  description: 'Expense description',
  createdAt: new Date().toISOString(),
  createdBy: uuidV4(),
  value: 10,
};

export const updateExpenseDtoMock: UpdateExpenseDto = {
  description: 'new description',
  value: 50,
};
