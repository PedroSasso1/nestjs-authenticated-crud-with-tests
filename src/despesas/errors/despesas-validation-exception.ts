import { HttpException, HttpStatus } from '@nestjs/common';

export class DespesasValidationException extends HttpException {
  constructor(message: string) {
    super(message, HttpStatus.UNPROCESSABLE_ENTITY);
    this.name = 'DespesasValidationException';
  }
}
