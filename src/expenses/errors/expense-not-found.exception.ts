import { HttpException, HttpStatus } from '@nestjs/common';

export class ExpenseNotFoundException extends HttpException {
  constructor(message: string) {
    super(message, HttpStatus.NOT_FOUND);
    this.name = 'ExpenseNotFoundException';
  }
}
