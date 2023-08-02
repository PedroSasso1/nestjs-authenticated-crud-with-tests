import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';

export const jwtStrategyName = 'jwt';

@Injectable()
export class JwtStrategyService extends PassportStrategy(
  Strategy,
  jwtStrategyName,
) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_SECRET,
    });
  }

  async validate(payload: unknown) {
    return payload;
  }
}
