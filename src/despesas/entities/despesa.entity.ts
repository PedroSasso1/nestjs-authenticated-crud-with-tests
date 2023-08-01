import {
  IsDate,
  IsNumber,
  IsString,
  MaxDate,
  MaxLength,
  Min,
  validateSync,
} from 'class-validator';

// Na entidade despesas, deverá conter:
// ● Id
// ● Descrição (descrição da despesa)
// ● Data (data de quando ocorreu a despesa)
// ● Usuário (usuário dono da despesa, um relacionamento com a tabela de Usuários)
// ● Valor (valor em reais da despesa)

export type DespesaProps = {
  id: number;
  description: string;
  createdAt: Date;
  createdBy: number;
  value: number;
};
export class Despesa {
  constructor(props: DespesaProps) {
    Object.assign(this, props);
    this.validator();
  }

  @IsNumber()
  id: number;

  @IsString()
  @MaxLength(191)
  description: string;

  @IsDate()
  @MaxDate(new Date())
  createdAt: Date;

  @IsNumber()
  createdBy: number;

  @IsNumber()
  @Min(0.01)
  value: number;

  private validator() {
    const errors = validateSync(this)
      .map(({ constraints }) => Object.values(constraints).join(';'))
      .join('');

    if (errors.length > 0) {
      throw new Error(errors);
    }

    return;
  }
}
