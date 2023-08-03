import { HttpException, HttpStatus } from '@nestjs/common';

export class UserValidationException extends HttpException {
  constructor(message: string) {
    super(message, HttpStatus.UNPROCESSABLE_ENTITY);
    this.name = 'UserValidationException';
  }
}
