import { RepositoryInterface } from 'src/@shared/repository-contracts';
import { User } from '../entities/user.entity';

export default interface UserRepository extends RepositoryInterface<User> {
  findByEmail(email: string): Promise<User>;
}
