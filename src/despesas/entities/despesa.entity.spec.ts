import { validDespesaMock } from '../../../test/mocks/despesas.mocks';
import { DespesasValidationException } from '../errors/despesas-validation-exception';
import { Despesa, DespesaProps } from './despesa.entity';

describe('Despesa Entity - Unit Tests', () => {
  describe('should invalidate id', () => {
    it('should be number', () => {
      const invalidId: any = 0;
      const invalidDespesaProps: DespesaProps = {
        ...validDespesaMock,
        id: invalidId,
      };
      expect(() => new Despesa(invalidDespesaProps)).toThrow();
    });

    test("shouldn't be empty", () => {
      const invalidEmptyId = '';
      const invalidDespesaProps: DespesaProps = {
        ...validDespesaMock,
        id: invalidEmptyId,
      };
      expect(() => new Despesa(invalidDespesaProps)).toThrow(
        DespesasValidationException,
      );
    });

    test('should be uuid v4', () => {
      const invalidUUID = 'invalid uuid';
      const invalidDespesaProps: DespesaProps = {
        ...validDespesaMock,
        id: invalidUUID,
      };
      expect(() => new Despesa(invalidDespesaProps)).toThrow(
        DespesasValidationException,
      );
    });
  });

  describe('should invalidate description', () => {
    it('should be string', () => {
      const invalidTypeDescription: any = 0;
      expect(
        () =>
          new Despesa({
            ...validDespesaMock,
            description: invalidTypeDescription,
          }),
      ).toThrow();
    });
    it("shouldn't pass 191 string length", () => {
      let invalidLengthDescription = '';
      for (let i = 0; i < 192; i++) {
        invalidLengthDescription += 'a';
      }

      expect(
        () =>
          new Despesa({
            ...validDespesaMock,
            description: invalidLengthDescription,
          }),
      ).toThrow();
    });
  });

  describe('should invalidate createdAt', () => {
    it('createdAt must be date', () => {
      const invalidTypeCreatedAt: any = 0;
      expect(
        () =>
          new Despesa({
            ...validDespesaMock,
            createdAt: invalidTypeCreatedAt,
          }),
      ).toThrow();
    });
    it("createdAt can't be future", () => {
      const now = new Date();
      jest.useFakeTimers();
      const nextYear = now.getFullYear() + 1;
      const future = new Date();
      future.setFullYear(nextYear);
      expect(
        () =>
          new Despesa({
            ...validDespesaMock,
            createdAt: future,
          }),
      ).toThrow();
      jest.useRealTimers();
    });
  });

  describe('should invalidate createdBy', () => {
    it('should be number', () => {
      const createdBy: any = 0;
      const invalidDespesaProps: DespesaProps = {
        ...validDespesaMock,
        createdBy: createdBy,
      };
      expect(() => new Despesa(invalidDespesaProps)).toThrow();
    });

    test("shouldn't be empty", () => {
      const invalidEmptyCreatedBy = '';
      const invalidDespesaProps: DespesaProps = {
        ...validDespesaMock,
        createdBy: invalidEmptyCreatedBy,
      };
      expect(() => new Despesa(invalidDespesaProps)).toThrow(
        DespesasValidationException,
      );
    });

    test('should be uuid v4', () => {
      const invalidUUID = 'invalid uuid';
      const invalidDespesaProps: DespesaProps = {
        ...validDespesaMock,
        createdBy: invalidUUID,
      };
      expect(() => new Despesa(invalidDespesaProps)).toThrow(
        DespesasValidationException,
      );
    });
  });

  describe('should invalidate value', () => {
    it('should be number', () => {
      const invalidTypeValue: any = '';
      const invalidDespesaProps: DespesaProps = {
        ...validDespesaMock,
        value: invalidTypeValue,
      };
      expect(() => new Despesa(invalidDespesaProps)).toThrow();
    });
    it("shouldn't be less than 0", () => {
      const invalidMinValue = 0;
      const invalidDespesaProps: DespesaProps = {
        ...validDespesaMock,
        value: invalidMinValue,
      };
      expect(() => new Despesa(invalidDespesaProps)).toThrow();
    });
  });

  it('should create valid instance of Despesa', () => {
    const despesa = new Despesa(validDespesaMock);

    expect(despesa.id).toBe(validDespesaMock.id);
    expect(despesa.description).toBe(validDespesaMock.description);
    expect(despesa.createdAt).toBe(validDespesaMock.createdAt);
    expect(despesa.createdBy).toBe(validDespesaMock.createdBy);
    expect(despesa.value).toBe(validDespesaMock.value);
  });
});
