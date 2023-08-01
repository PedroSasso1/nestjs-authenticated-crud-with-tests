import { Despesa, DespesaProps } from './despesa.entity';

const validDespesa: DespesaProps = {
  id: 1,
  description: 'despesa description',
  createdAt: new Date(),
  createdBy: 1,
  value: 10,
};
describe('Despesa Entity - Unit Tests', () => {
  describe('should invalidate id', () => {
    it('should be number', () => {
      const invalidId: any = '';
      const invalidDespesaProps: DespesaProps = {
        ...validDespesa,
        id: invalidId,
      };
      expect(() => new Despesa(invalidDespesaProps)).toThrow();
    });
  });

  describe('should invalidate description', () => {
    it('should be string', () => {
      const invalidTypeDescription: any = 0;
      expect(
        () =>
          new Despesa({
            ...validDespesa,
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
            ...validDespesa,
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
            ...validDespesa,
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
            ...validDespesa,
            createdAt: future,
          }),
      ).toThrow();
      jest.useRealTimers();
    });
  });

  describe('should invalidate createdBy', () => {
    it('should be number', () => {
      const invalidTypeCreatedBy: any = '';
      const invalidDespesaProps: DespesaProps = {
        ...validDespesa,
        createdBy: invalidTypeCreatedBy,
      };
      expect(() => new Despesa(invalidDespesaProps)).toThrow();
    });
  });

  describe('should invalidate value', () => {
    it('should be number', () => {
      const invalidTypeValue: any = '';
      const invalidDespesaProps: DespesaProps = {
        ...validDespesa,
        value: invalidTypeValue,
      };
      expect(() => new Despesa(invalidDespesaProps)).toThrow();
    });
    it("shouldn't be less than 0", () => {
      const invalidMinValue = 0;
      const invalidDespesaProps: DespesaProps = {
        ...validDespesa,
        value: invalidMinValue,
      };
      expect(() => new Despesa(invalidDespesaProps)).toThrow();
    });
  });

  it('should create valid instance of Despesa', () => {
    const despesa = new Despesa(validDespesa);

    expect(despesa.id).toBe(validDespesa.id);
    expect(despesa.description).toBe(validDespesa.description);
    expect(despesa.createdAt).toBe(validDespesa.createdAt);
    expect(despesa.createdBy).toBe(validDespesa.createdBy);
    expect(despesa.value).toBe(validDespesa.value);
  });
});
