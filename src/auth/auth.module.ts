import { Module } from '@nestjs/common';
import { AuthController } from './auth/auth.controller';
import { AuthService } from './auth/auth.service';
import { JwtStrategyService } from './jwt-strategy/jwt-strategy.service';
import { UsersService } from '../users/users.service';

@Module({
  controllers: [AuthController],
  providers: [AuthService, JwtStrategyService, UsersService],
})
export class AuthModule {}
