import {
  IsDate,
  IsNotEmpty,
  IsNumber,
  IsPositive,
  IsString,
  IsUUID,
  MaxDate,
  MaxLength,
  Min,
  validateSync,
} from 'class-validator';
import { ExpenseValidationException } from '../errors/expense-validation.exception';
import { Util } from '../../util/util';

export type ExpenseProps = {
  id: string;
  description: string;
  createdAt: Date;
  createdBy: string;
  value: number;
};
export class Expense {
  constructor(props: ExpenseProps) {
    this.id = props.id;
    this.description = props.description;
    this.createdAt = props.createdAt;
    this.createdBy = props.createdBy;
    this.value = props.value;
    this.validator();
  }

  @IsString()
  @IsNotEmpty()
  @IsUUID(4)
  id: string;

  @IsString()
  @MaxLength(191)
  description: string;

  @IsDate()
  @MaxDate(Util.dateAddMinutes(new Date()))
  createdAt: Date;

  @IsString()
  @IsNotEmpty()
  @IsUUID(4)
  createdBy: string;

  @IsNumber()
  @IsPositive()
  @Min(0.01)
  value: number;

  private validator() {
    const errors = validateSync(this)
      .map(({ constraints }) => Object.values(constraints).join('; '))
      .join('; ');

    if (errors.length > 0) {
      throw new ExpenseValidationException(errors);
    }

    return;
  }
}
