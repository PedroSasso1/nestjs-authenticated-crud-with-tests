import { HttpException, HttpStatus } from '@nestjs/common';

export class DespesaNotFoundException extends HttpException {
  constructor(message: string) {
    super(message, HttpStatus.NOT_FOUND);
    this.name = 'DespesaNotFoundException';
  }
}
