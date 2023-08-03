import { HttpException, HttpStatus } from '@nestjs/common';

export class UserExistsException extends HttpException {
  constructor(message: string) {
    super(message, HttpStatus.CONFLICT);
    this.name = 'UserExistsException';
  }
}
