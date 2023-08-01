import { RepositoryInterface } from 'src/@shared/repository-contracts';
import { User } from '../entities/user.entity';

export default interface DespesasRepository extends RepositoryInterface<User> {}
