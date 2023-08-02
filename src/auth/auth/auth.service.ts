import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../../users/users.service';
import { compare } from 'bcrypt';
import { InvalidCredentialsException } from '../../errors/invalid-credentials-exception';
import { UserNotFoundException } from '../../errors/user-not-found-exception';

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    private userService: UsersService,
  ) {}

  async login(username: string, password: string) {
    const user = await this.validateCredentials(username, password);
    const payload = {
      sub: user.id,
      username: user.email,
    };

    return this.jwtService.sign(payload);
  }

  async validateCredentials(username: string, password: string) {
    const user = await this.userService.findOneByEmail(username);

    if (!user) {
      throw new UserNotFoundException(
        `User not found with username: ${username}`,
      );
    }

    const passwordMatches = await compare(password, user.password);

    if (!passwordMatches) {
      throw new InvalidCredentialsException('invalid credentials');
    }

    return user;
  }
}
