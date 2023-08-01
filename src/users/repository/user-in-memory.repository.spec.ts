import { User } from '../entities/user.entity';
import { UserInMemoryRepository } from './user-in-memory.repository';

describe('UserInMemoryRepository - Unit Tests', () => {
  let repository: UserInMemoryRepository;

  beforeEach(() => (repository = new UserInMemoryRepository()));
  it('should throw error when user not found by email', async () => {
    expect(repository.findByEmail('email@test.com')).rejects.toThrow(
      new Error('Entity not found using Email email@test.com'),
    );
  });

  it('should find user by email', async () => {
    const user = new User({ id: 1, email: 'email@test.com' });
    await repository.insert(user);
    const foundUser = await repository.findByEmail('email@test.com');
    expect(user).toStrictEqual(foundUser);
  });
});
