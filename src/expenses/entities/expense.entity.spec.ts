import { validExpenseMock } from '../../../test/mocks/expenses.mocks';
import { ExpenseValidationException } from '../errors/expense-validation.exception';
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
        ExpenseValidationException,
      );
    });

    test("shouldn't be empty", () => {
      const invalidEmptyId = '';
      const invalidExpenseProps: ExpenseProps = {
        ...validExpenseMock,
        id: invalidEmptyId,
      };
      expect(() => new Expense(invalidExpenseProps)).toThrow(
        ExpenseValidationException,
      );
    });

    test('should be uuid v4', () => {
      const invalidUUID = 'invalid uuid';
      const invalidExpenseProps: ExpenseProps = {
        ...validExpenseMock,
        id: invalidUUID,
      };
      expect(() => new Expense(invalidExpenseProps)).toThrow(
        ExpenseValidationException,
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
      ).toThrow(ExpenseValidationException);
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
      ).toThrow(ExpenseValidationException);
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
      ).toThrow(ExpenseValidationException);
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
      ).toThrow(ExpenseValidationException);
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
        ExpenseValidationException,
      );
    });

    test("shouldn't be empty", () => {
      const invalidEmptyCreatedBy = '';
      const invalidExpenseProps: ExpenseProps = {
        ...validExpenseMock,
        createdBy: invalidEmptyCreatedBy,
      };
      expect(() => new Expense(invalidExpenseProps)).toThrow(
        ExpenseValidationException,
      );
    });

    test('should be uuid v4', () => {
      const invalidUUID = 'invalid uuid';
      const invalidExpenseProps: ExpenseProps = {
        ...validExpenseMock,
        createdBy: invalidUUID,
      };
      expect(() => new Expense(invalidExpenseProps)).toThrow(
        ExpenseValidationException,
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
        ExpenseValidationException,
      );
    });
    it("shouldn't be less than 0", () => {
      const invalidMinValue = 0;
      const invalidExpenseProps: ExpenseProps = {
        ...validExpenseMock,
        value: invalidMinValue,
      };
      expect(() => new Expense(invalidExpenseProps)).toThrow(
        ExpenseValidationException,
      );
    });

    it("shouldn't be negative number", () => {
      const invalidMinValue = -1;
      const invalidExpenseProps: ExpenseProps = {
        ...validExpenseMock,
        value: invalidMinValue,
      };
      expect(() => new Expense(invalidExpenseProps)).toThrow(
        ExpenseValidationException,
      );
    });
  });

  it('should create valid instance of Expense', () => {
    const expense = new Expense(validExpenseMock);

    expect(expense.id).toBe(validExpenseMock.id);
    expect(expense.description).toBe(validExpenseMock.description);
    expect(expense.createdAt).toBe(validExpenseMock.createdAt);
    expect(expense.createdBy).toBe(validExpenseMock.createdBy);
    expect(expense.value).toBe(validExpenseMock.value);
  });
});
