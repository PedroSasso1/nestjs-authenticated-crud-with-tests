import { IsNumber, validateSync } from 'class-validator';

export type UserProps = {
  id: number;
  email: string;
};

export class User {
  constructor(props: UserProps) {
    Object.assign(this, props);
    this.validator();
  }

  @IsNumber()
  id: number;
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
