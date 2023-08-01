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
      const invalidCreatedBy: any = '';
      const invalidDespesaProps: DespesaProps = {
        ...validDespesa,
        createdBy: invalidCreatedBy,
      };
      expect(() => new Despesa(invalidDespesaProps)).toThrow();
    });
  });

  describe('should invalidate value', () => {
    it.todo('should be number');
    it.todo("shouldn't be empty");
  });

  it.todo('should create valid instance of Despesa');
});
