import { Injectable } from '@nestjs/common';
import { CreateDespesaDto } from './dto/create-despesa.dto';
import { UpdateDespesaDto } from './dto/update-despesa.dto';
import { Despesa } from './entities/despesa.entity';
import { UsersService } from '../users/users.service';
import { UserNotFoundException } from '../users/errors/user-not-found.exception';
import { v4 as uuidV4 } from 'uuid';
import { DespesaNotFoundException } from './errors/despesa-not-found.exception';
import { Util } from '../util/util';
import { NotAllowedToAccessDespesaException } from './errors/despesa-not-allowed-access.exception';
import { MailerService } from '../mailer/mailer.service';

@Injectable()
export class DespesasService {
  despesasInMemoryTable: Partial<Despesa>[] = [];

  constructor(
    private usersService: UsersService,
    private mailerService: MailerService,
  ) {}

  async create(createDespesaDto: CreateDespesaDto) {
    const user = await this.usersService.findOne(createDespesaDto.createdBy);
    if (!user) {
      throw new UserNotFoundException(
        `Error on Despesas Service: user not found with id: ${createDespesaDto.createdBy}`,
      );
    }

    const despesa = new Despesa({
      id: uuidV4(),
      createdAt: Util.parseDateString(createDespesaDto.createdAt),
      createdBy: createDespesaDto.createdBy,
      description: createDespesaDto.description,
      value: createDespesaDto.value,
    });

    this.despesasInMemoryTable.push(despesa);

    await this.mailerService.sendEmail({
      body: Util.getDespesaMailBody(despesa),
      subject: 'Despesa cadastrada!',
      toAddresses: [user.email],
    });

    return despesa.id;
  }

  async findAll(createdBy: string) {
    const filteredByOwner = this.despesasInMemoryTable.filter(
      (d) => d.createdBy === createdBy,
    );

    const withFormattedMoney = filteredByOwner.map((d) => ({
      ...d,
      value: Util.formatNumberToCurrency(d.value),
      createdAt: d.createdAt.toISOString(),
    }));

    return withFormattedMoney;
  }

  async findOne(id: string, createdBy: string) {
    const despesa = await this._get(id, createdBy);
    return {
      ...despesa,
      value: Util.formatNumberToCurrency(despesa.value),
      createdAt: despesa.createdAt.toISOString(),
    };
  }

  async update(
    id: string,
    updateDespesaDto: UpdateDespesaDto,
    createdBy: string,
  ) {
    const foundDespesa = await this._get(id, createdBy);

    const despesa = new Despesa({
      createdAt: foundDespesa.createdAt,
      createdBy: foundDespesa.createdBy,
      description: updateDespesaDto.description,
      id: id,
      value: updateDespesaDto.value,
    });

    const foundIndex = this.despesasInMemoryTable.findIndex((d) => d.id === id);

    this.despesasInMemoryTable[foundIndex] = despesa;
  }

  async remove(id: string, createdBy: string) {
    await this._get(id, createdBy);
    const foundIndex = this.despesasInMemoryTable.findIndex((d) => d.id === id);
    this.despesasInMemoryTable.splice(foundIndex, 1);
  }

  protected async _get(id: string, createdBy: string) {
    const despesa = this.despesasInMemoryTable.find((d) => d.id === id);
    if (!despesa) {
      throw new DespesaNotFoundException(`Despesa not found with ID: ${id}`);
    }
    await this._isDespesaOwner(createdBy, despesa);
    return despesa;
  }

  protected async _isDespesaOwner(
    requestCreatedBy: string,
    despesa: Partial<Despesa>,
  ) {
    if (requestCreatedBy !== despesa.createdBy) {
      throw new NotAllowedToAccessDespesaException(
        'You can only access the despesas that you own',
      );
    }
  }
}
