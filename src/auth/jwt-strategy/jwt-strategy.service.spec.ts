import { Test, TestingModule } from '@nestjs/testing';
import { JwtStrategyService } from './jwt-strategy.service';
import { ConfigModule } from '@nestjs/config';

describe('JwtStrategyService', () => {
  let service: JwtStrategyService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [ConfigModule.forRoot()],
      providers: [JwtStrategyService],
    }).compile();

    service = module.get<JwtStrategyService>(JwtStrategyService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
