import {
  IsEmail,
  IsNotEmpty,
  IsNumber,
  IsString,
  validateSync,
} from 'class-validator';

export type UserProps = {
  id: number;
  email: string;
};

export class User {
  constructor(props: UserProps) {
    this.id = props.id;
    this.email = props.email;
    this.validator();
  }

  @IsNumber()
  id: number;

  @IsString()
  @IsNotEmpty()
  @IsEmail()
  email: string;

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
