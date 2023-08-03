import { validExpenseMock } from '../../../test/mocks/expenses.mocks';
import { ExpensesValidationException } from '../errors/expenses-validation.exception';
import { Expense, ExpenseProps } from './expense.entity';

describe('Expense Entity - Unit Tests', () => {
  describe('should invalidate id', () => {
    it('should be number', () => {
      const invalidId: any = 0;
      const invalidExpenseProps: ExpenseProps = {
        ...validExpenseMock,
        id: invalidId,
      };
      expect(() => new Expense(invalidExpenseProps)).toThrow(
        ExpensesValidationException,
      );
    });

    test("shouldn't be empty", () => {
      const invalidEmptyId = '';
      const invalidExpenseProps: ExpenseProps = {
        ...validExpenseMock,
        id: invalidEmptyId,
      };
      expect(() => new Expense(invalidExpenseProps)).toThrow(
        ExpensesValidationException,
      );
    });

    test('should be uuid v4', () => {
      const invalidUUID = 'invalid uuid';
      const invalidExpenseProps: ExpenseProps = {
        ...validExpenseMock,
        id: invalidUUID,
      };
      expect(() => new Expense(invalidExpenseProps)).toThrow(
        ExpensesValidationException,
      );
    });
  });

  describe('should invalidate description', () => {
    it('should be string', () => {
      const invalidTypeDescription: any = 0;
      expect(
        () =>
          new Expense({
            ...validExpenseMock,
            description: invalidTypeDescription,
          }),
      ).toThrow(ExpensesValidationException);
    });
    it("shouldn't pass 191 string length", () => {
      let invalidLengthDescription = '';
      for (let i = 0; i < 192; i++) {
        invalidLengthDescription += 'a';
      }

      expect(
        () =>
          new Expense({
            ...validExpenseMock,
            description: invalidLengthDescription,
          }),
      ).toThrow(ExpensesValidationException);
    });
  });

  describe('should invalidate createdAt', () => {
    it('createdAt must be date', () => {
      const invalidTypeCreatedAt: any = 0;
      expect(
        () =>
          new Expense({
            ...validExpenseMock,
            createdAt: invalidTypeCreatedAt,
          }),
      ).toThrow(ExpensesValidationException);
    });
    it("createdAt can't be future", () => {
      const now = new Date();
      jest.useFakeTimers();
      const nextYear = now.getFullYear() + 1;
      const future = new Date();
      future.setFullYear(nextYear);
      expect(
        () =>
          new Expense({
            ...validExpenseMock,
            createdAt: future,
          }),
      ).toThrow(ExpensesValidationException);
      jest.useRealTimers();
    });
  });

  describe('should invalidate createdBy', () => {
    it('should be number', () => {
      const createdBy: any = 0;
      const invalidExpenseProps: ExpenseProps = {
        ...validExpenseMock,
        createdBy: createdBy,
      };
      expect(() => new Expense(invalidExpenseProps)).toThrow(
        ExpensesValidationException,
      );
    });

    test("shouldn't be empty", () => {
      const invalidEmptyCreatedBy = '';
      const invalidExpenseProps: ExpenseProps = {
        ...validExpenseMock,
        createdBy: invalidEmptyCreatedBy,
      };
      expect(() => new Expense(invalidExpenseProps)).toThrow(
        ExpensesValidationException,
      );
    });

    test('should be uuid v4', () => {
      const invalidUUID = 'invalid uuid';
      const invalidExpenseProps: ExpenseProps = {
        ...validExpenseMock,
        createdBy: invalidUUID,
      };
      expect(() => new Expense(invalidExpenseProps)).toThrow(
        ExpensesValidationException,
      );
    });
  });

  describe('should invalidate value', () => {
    it('should be number', () => {
      const invalidTypeValue: any = '';
      const invalidExpenseProps: ExpenseProps = {
        ...validExpenseMock,
        value: invalidTypeValue,
      };
      expect(() => new Expense(invalidExpenseProps)).toThrow(
        ExpensesValidationException,
      );
    });
    it("shouldn't be less than 0", () => {
      const invalidMinValue = 0;
      const invalidExpenseProps: ExpenseProps = {
        ...validExpenseMock,
        value: invalidMinValue,
      };
      expect(() => new Expense(invalidExpenseProps)).toThrow(
        ExpensesValidationException,
      );
    });

    it("shouldn't be negative number", () => {
      const invalidMinValue = -1;
      const invalidExpenseProps: ExpenseProps = {
        ...validExpenseMock,
        value: invalidMinValue,
      };
      expect(() => new Expense(invalidExpenseProps)).toThrow(
        ExpensesValidationException,
      );
    });
  });

  it('should create valid instance of Expense', () => {
    const Expense = new Expense(validExpenseMock);

    expect(Expense.id).toBe(validExpenseMock.id);
    expect(Expense.description).toBe(validExpenseMock.description);
    expect(Expense.createdAt).toBe(validExpenseMock.createdAt);
    expect(Expense.createdBy).toBe(validExpenseMock.createdBy);
    expect(Expense.value).toBe(validExpenseMock.value);
  });
});
