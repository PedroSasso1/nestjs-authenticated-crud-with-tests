import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';

@Controller()
export class AuthController {
  constructor(private authService: AuthService) {}
  @Post('login')
  async login(@Body() body: LoginDto) {
    return {
      token: await this.authService.login(body.username, body.password),
    };
  }
}
