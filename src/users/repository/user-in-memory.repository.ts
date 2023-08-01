import InMemoryRepository from 'src/@shared/in-memory.repository';
import { User } from '../entities/user.entity';
import UserRepository from './user.repository';

export class DespesaInMemoryRepository
  extends InMemoryRepository<User>
  implements UserRepository {}
