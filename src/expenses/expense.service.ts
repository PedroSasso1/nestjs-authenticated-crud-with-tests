import { Injectable } from '@nestjs/common';
import { CreateExpenseDto } from './dto/create-expense.dto';
import { UpdateExpenseDto } from './dto/update-expense.dto';
import { Expense } from './entities/expense.entity';
import { UsersService } from '../users/users.service';
import { UserNotFoundException } from '../users/errors/user-not-found.exception';
import { v4 as uuidV4 } from 'uuid';
import { ExpenseNotFoundException } from './errors/expense-not-found.exception';
import { Util } from '../util/util';
import { NotAllowedToAccessExpenseException } from './errors/expense-not-allowed-access.exception';
import { MailerService } from '../mailer/mailer.service';

@Injectable()
export class ExpensesService {
  ExpensesInMemoryTable: Partial<Expense>[] = [];

  constructor(
    private usersService: UsersService,
    private mailerService: MailerService,
  ) {}

  async create(createExpenseDto: CreateExpenseDto) {
    const user = await this.usersService.findOne(createExpenseDto.createdBy);
    if (!user) {
      throw new UserNotFoundException(
        `Error on Expenses Service: user not found with id: ${createExpenseDto.createdBy}`,
      );
    }

    const expense = new Expense({
      id: uuidV4(),
      createdAt: Util.parseDateString(createExpenseDto.createdAt),
      createdBy: createExpenseDto.createdBy,
      description: createExpenseDto.description,
      value: createExpenseDto.value,
    });

    this.ExpensesInMemoryTable.push(expense);

    await this.mailerService.sendEmail({
      body: Util.getExpenseMailBody(expense),
      subject: 'Expense cadastrada!',
      toAddresses: [user.email],
    });

    return expense.id;
  }

  async findAll(createdBy: string) {
    const filteredByOwner = this.ExpensesInMemoryTable.filter(
      (d) => d.createdBy === createdBy,
    );

    const withFormattedMoney = filteredByOwner.map((d) => ({
      ...d,
      value: Util.formatNumberToCurrency(d.value),
      createdAt: d.createdAt.toISOString(),
    }));

    return withFormattedMoney;
  }

  async findOne(id: string, createdBy: string) {
    const Expense = await this._get(id, createdBy);
    return {
      ...Expense,
      value: Util.formatNumberToCurrency(Expense.value),
      createdAt: Expense.createdAt.toISOString(),
    };
  }

  async update(
    id: string,
    updateExpenseDto: UpdateExpenseDto,
    createdBy: string,
  ) {
    const foundExpense = await this._get(id, createdBy);

    const expense = new Expense({
      createdAt: foundExpense.createdAt,
      createdBy: foundExpense.createdBy,
      description: updateExpenseDto.description,
      id: id,
      value: updateExpenseDto.value,
    });

    const foundIndex = this.ExpensesInMemoryTable.findIndex((d) => d.id === id);

    this.ExpensesInMemoryTable[foundIndex] = expense;
  }

  async remove(id: string, createdBy: string) {
    await this._get(id, createdBy);
    const foundIndex = this.ExpensesInMemoryTable.findIndex((d) => d.id === id);
    this.ExpensesInMemoryTable.splice(foundIndex, 1);
  }

  protected async _get(id: string, createdBy: string) {
    const Expense = this.ExpensesInMemoryTable.find((d) => d.id === id);
    if (!Expense) {
      throw new ExpenseNotFoundException(`Expense not found with ID: ${id}`);
    }
    await this._isExpenseOwner(createdBy, Expense);
    return Expense;
  }

  protected async _isExpenseOwner(
    requestCreatedBy: string,
    Expense: Partial<Expense>,
  ) {
    if (requestCreatedBy !== Expense.createdBy) {
      throw new NotAllowedToAccessExpenseException(
        'You can only access the Expenses that you own',
      );
    }
  }
}
