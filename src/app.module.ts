import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DespesasModule } from './despesas/despesas.module';
import { UsersModule } from './users/users.module';

@Module({
  imports: [DespesasModule, UsersModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
