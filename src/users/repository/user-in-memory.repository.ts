import InMemoryRepository from '../../@shared/in-memory.repository';
import { User } from '../entities/user.entity';
import UserRepository from './user.repository';

export class UserInMemoryRepository
  extends InMemoryRepository<User>
  implements UserRepository
{
  async findByEmail(email: string): Promise<User> {
    const item = this.items.find((item) => item.email === email);
    if (!item) {
      throw new Error(`Entity not found using Email ${email}`);
    }
    return item;
  }
}
