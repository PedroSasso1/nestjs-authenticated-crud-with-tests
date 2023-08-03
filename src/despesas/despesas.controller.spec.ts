import { Test, TestingModule } from '@nestjs/testing';
import { DespesasController } from './despesas.controller';
import { DespesasService } from './despesas.service';
import { UsersModule } from '../users/users.module';

describe('DespesasController', () => {
  let controller: DespesasController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [UsersModule],
      controllers: [DespesasController],
      providers: [DespesasService],
    }).compile();

    controller = module.get<DespesasController>(DespesasController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
