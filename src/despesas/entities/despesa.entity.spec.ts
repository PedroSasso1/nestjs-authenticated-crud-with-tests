import { Despesa } from './despesa.entity';

describe('Despesa Entity - Unit Tests', () => {
  describe('should invalidate id', () => {
    it('should be number', () => {
      const invalidId: any = '';
      const invalidDespesaProps: any = { id: invalidId };
      expect(() => new Despesa(invalidDespesaProps)).toThrow();
    });
  });

  describe('should invalidate description', () => {
    it.todo('should be string');
    it.todo("shouldn't pass 191 string length");
  });

  describe('should invalidate createdAt', () => {
    it.todo('createdAt must be date');
    it.todo("createdAt can't be future");
  });

  describe('should invalidate createdBy', () => {
    it.todo('should be number');
    it.todo("shouldn't be empty");
  });

  describe('should invalidate value', () => {
    it.todo('should be number');
    it.todo("shouldn't be empty");
  });

  it.todo('should create valid instance of Despesa');
});
