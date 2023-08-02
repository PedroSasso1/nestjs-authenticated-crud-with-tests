import {
  IsEmail,
  IsNotEmpty,
  IsString,
  IsUUID,
  validateSync,
} from 'class-validator';
import { UserValidationException } from '../../errors/user-validation-exception';

export type UserProps = {
  id: string;
  email: string;
  password: string;
};

export class User {
  constructor(props: UserProps) {
    this.id = props.id;
    this.email = props.email;
    this.password = props.password;
    this.validator();
  }

  @IsString()
  @IsNotEmpty()
  @IsUUID(4)
  id: string;

  @IsString()
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsString()
  @IsNotEmpty()
  password: string;

  private validator() {
    const errors = validateSync(this)
      .map(({ constraints }) => Object.values(constraints).join(';'))
      .join('');

    console.log(errors);
    if (errors.length > 0) {
      throw new UserValidationException(errors);
    }

    return;
  }
}
