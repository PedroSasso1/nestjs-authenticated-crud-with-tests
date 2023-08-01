import { User, UserProps } from './user.entity';

const validUser: UserProps = {
  id: 1,
  email: 'user@email.com',
};
describe('User Entity - Unit Tests', () => {
  describe('should invalidate id', () => {
    test('should be number', () => {
      const invalidTypeId: any = '';
      const invalidUserProps: UserProps = {
        ...validUser,
        id: invalidTypeId,
      };
      expect(() => new User(invalidUserProps)).toThrow();
    });
  });

  describe('should invalidate email', () => {
    test.todo('should be string');
    test.todo("shouldn't be empty");
    test.todo('should be a valid email');
  });

  test.todo('should create a valid instance of User');
});
