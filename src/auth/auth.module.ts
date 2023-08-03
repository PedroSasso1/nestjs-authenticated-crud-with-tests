import { Module } from '@nestjs/common';
import { AuthController } from './auth/auth.controller';
import { AuthService } from './auth/auth.service';
import { JwtStrategyService } from './jwt-strategy/jwt-strategy.service';
import { JwtModule } from '@nestjs/jwt';
import { UsersModule } from '../users/users.module';
import { ConfigModule } from '@nestjs/config';
import { JwtGuard } from './auth/jwt.guard';

@Module({
  imports: [
    ConfigModule.forRoot(),
    UsersModule,
    JwtModule.register({
      secret: process.env.JWT_SECRET,
      signOptions: {
        expiresIn: '10h',
      },
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategyService, JwtGuard],
  exports: [AuthService, JwtGuard],
})
export class AuthModule {}
