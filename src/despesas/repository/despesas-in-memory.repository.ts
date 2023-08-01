import InMemoryRepository from 'src/@shared/in-memory.repository';
import { Despesa } from '../entities/despesa.entity';
import DespesasRepository from './despesas.repository';

export class DespesaInMemoryRepository
  extends InMemoryRepository<Despesa>
  implements DespesasRepository {}
