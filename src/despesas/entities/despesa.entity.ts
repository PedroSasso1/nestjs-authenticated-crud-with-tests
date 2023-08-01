import {
  IsDate,
  IsNumber,
  IsString,
  MaxDate,
  MaxLength,
  Min,
  validateSync,
} from 'class-validator';

export type DespesaProps = {
  id: number;
  description: string;
  createdAt: Date;
  createdBy: number;
  value: number;
};
export class Despesa {
  constructor(props: DespesaProps) {
    this.id = props.id;
    this.description = props.description;
    this.createdAt = props.createdAt;
    this.createdBy = props.createdBy;
    this.value = props.value;
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
