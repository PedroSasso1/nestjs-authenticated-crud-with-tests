import { RepositoryInterface } from 'src/@shared/repository-contracts';
import { Despesa } from '../entities/despesa.entity';

export default interface DespesasRepository
  extends RepositoryInterface<Despesa> {}
