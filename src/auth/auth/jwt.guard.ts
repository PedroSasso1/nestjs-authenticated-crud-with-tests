import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { jwtStrategyName } from '../jwt-strategy/jwt-strategy.service';

@Injectable()
export class JwtGuard extends AuthGuard(jwtStrategyName) {}
