import { HttpException, HttpStatus } from '@nestjs/common';

export class ExpenseValidationException extends HttpException {
  constructor(message: string) {
    super(message, HttpStatus.UNPROCESSABLE_ENTITY);
    this.name = 'ExpenseValidationException';
  }
}
