import { Injectable } from '@nestjs/common';
import { CreateDespesaDto } from './dto/create-despesa.dto';
import { UpdateDespesaDto } from './dto/update-despesa.dto';
import { Despesa } from './entities/despesa.entity';
import { UsersService } from '../users/users.service';
import { UserNotFoundException } from '../users/errors/user-not-found.exception';
import { v4 as uuidV4 } from 'uuid';
import { DespesaNotFoundException } from './errors/despesa-not-found.exception';

@Injectable()
export class DespesasService {
  despesasInMemoryTable: Partial<Despesa>[] = [];

  constructor(private usersService: UsersService) {}

  async create(createDespesaDto: CreateDespesaDto) {
    const user = await this.usersService.findOne(createDespesaDto.createdBy);
    if (!user) {
      throw new UserNotFoundException(
        `Error on Despesas Service: user not found with id: ${createDespesaDto.createdBy}`,
      );
    }

    const despesa = new Despesa({
      id: uuidV4(),
      createdAt: createDespesaDto.createdAt,
      createdBy: createDespesaDto.createdBy,
      description: createDespesaDto.description,
      value: createDespesaDto.value,
    });

    this.despesasInMemoryTable.push(despesa);

    return despesa.id;
  }

  async findAll() {
    return this.despesasInMemoryTable;
  }

  async findOne(id: string) {
    return this._get(id);
  }

  async update(updateDespesaDto: UpdateDespesaDto) {
    const { createdBy, createdAt } = await this._get(updateDespesaDto.id);

    const despesa = new Despesa({
      createdAt,
      createdBy,
      description: updateDespesaDto.description,
      id: updateDespesaDto.id,
      value: updateDespesaDto.value,
    });

    const foundIndex = this.despesasInMemoryTable.findIndex(
      (d) => d.id === updateDespesaDto.id,
    );

    this.despesasInMemoryTable[foundIndex] = despesa;
  }

  async remove(id: string) {
    await this._get(id);
    const foundIndex = this.despesasInMemoryTable.findIndex((d) => d.id === id);
    this.despesasInMemoryTable.splice(foundIndex, 1);
  }

  protected async _get(id: string) {
    const despesa = this.despesasInMemoryTable.find((d) => d.id === id);
    if (!despesa) {
      throw new DespesaNotFoundException(`Despesa not found with ID: ${id}`);
    }
    return despesa;
  }
}
