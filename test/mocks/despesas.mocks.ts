import { DespesaProps } from '../../src/despesas/entities/despesa.entity';
import { v4 as uuidV4 } from 'uuid';

export const validDespesaMock: DespesaProps = {
  id: uuidV4(),
  description: 'despesa description',
  createdAt: new Date(),
  createdBy: uuidV4(),
  value: 10,
};
