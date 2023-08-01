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
    test('should be string', () => {
      const invalidTypeEmail: any = 0;
      const invalidUserProps: UserProps = {
        ...validUser,
        email: invalidTypeEmail,
      };
      expect(() => new User(invalidUserProps)).toThrow();
    });
    test("shouldn't be empty", () => {
      const invalidEmptyEmail = '';
      const invalidUserProps: UserProps = {
        ...validUser,
        email: invalidEmptyEmail,
      };
      expect(() => new User(invalidUserProps)).toThrow();
    });
    test('should be a valid email', () => {
      const invalidEmail = 'email';
      const invalidUserProps: UserProps = {
        ...validUser,
        email: invalidEmail,
      };
      expect(() => new User(invalidUserProps)).toThrow();
    });
  });

  test('should create a valid instance of User', () => {
    const user = new User(validUser);

    expect(user.id).toBe(validUser.id);
    expect(user.email).toBe(validUser.email);
  });
});
