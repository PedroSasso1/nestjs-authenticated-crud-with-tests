import { UserValidationException } from '../errors/user-validation.exception';
import { validUserMock } from '../../../test/mocks/user.mocks';
import { User, UserProps } from './user.entity';

describe('User Entity - Unit Tests', () => {
  describe('should invalidate id', () => {
    test('should be string', () => {
      const invalidTypeId: any = 0;
      const invalidUserProps: UserProps = {
        ...validUserMock,
        id: invalidTypeId,
      };
      expect(() => new User(invalidUserProps)).toThrow(UserValidationException);
    });

    test("shouldn't be empty", () => {
      const invalidEmptyId = '';
      const invalidUserProps: UserProps = {
        ...validUserMock,
        id: invalidEmptyId,
      };
      expect(() => new User(invalidUserProps)).toThrow(UserValidationException);
    });

    test('should be uuid v4', () => {
      const invalidUUID = 'invalid uuid';
      const invalidUserProps: UserProps = {
        ...validUserMock,
        id: invalidUUID,
      };
      expect(() => new User(invalidUserProps)).toThrow(UserValidationException);
    });
  });

  describe('should invalidate email', () => {
    test('should be string', () => {
      const invalidTypeEmail: any = 0;
      const invalidUserProps: UserProps = {
        ...validUserMock,
        email: invalidTypeEmail,
      };
      expect(() => new User(invalidUserProps)).toThrow(UserValidationException);
    });
    test("shouldn't be empty", () => {
      const invalidEmptyEmail = '';
      const invalidUserProps: UserProps = {
        ...validUserMock,
        email: invalidEmptyEmail,
      };
      expect(() => new User(invalidUserProps)).toThrow(UserValidationException);
    });
    test('should be a valid email', () => {
      const invalidEmail = 'email';
      const invalidUserProps: UserProps = {
        ...validUserMock,
        email: invalidEmail,
      };
      expect(() => new User(invalidUserProps)).toThrow(UserValidationException);
    });
  });

  describe('should invalidate password', () => {
    test('should be string', () => {
      const invalidTypePassword: any = 0;
      const invalidUserProps: UserProps = {
        ...validUserMock,
        password: invalidTypePassword,
      };
      expect(() => new User(invalidUserProps)).toThrow(UserValidationException);
    });
    test("shouldn't be empty", () => {
      const invalidEmptyPassword = '';
      const invalidUserProps: UserProps = {
        ...validUserMock,
        password: invalidEmptyPassword,
      };
      expect(() => new User(invalidUserProps)).toThrow(UserValidationException);
    });
  });

  test('should create a valid instance of User', () => {
    const user = new User(validUserMock);

    expect(user.id).toBe(validUserMock.id);
    expect(user.email).toBe(validUserMock.email);
  });
});
