import { CreateDespesaDto } from 'src/despesas/dto/create-despesa.dto';
import { DespesaProps } from '../../src/despesas/entities/despesa.entity';
import { v4 as uuidV4 } from 'uuid';
import { UpdateDespesaDto } from 'src/despesas/dto/update-despesa.dto';

export const validDespesaMock: DespesaProps = {
  id: uuidV4(),
  description: 'despesa description',
  createdAt: new Date(),
  createdBy: uuidV4(),
  value: 10,
};

export const createDespesaDtoMock: CreateDespesaDto = {
  description: 'despesa description',
  createdAt: new Date(),
  createdBy: uuidV4(),
  value: 10,
};

export const updateDespesaDtoMock: UpdateDespesaDto = {
  id: uuidV4(),
  description: 'new description',
  value: 50,
};
