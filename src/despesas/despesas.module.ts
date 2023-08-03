import { Module } from '@nestjs/common';
import { DespesasService } from './despesas.service';
import { DespesasController } from './despesas.controller';
import { UsersModule } from '../users/users.module';
import { MailerModule } from '../mailer/mailer.module';

@Module({
  imports: [UsersModule, MailerModule],
  controllers: [DespesasController],
  providers: [DespesasService],
})
export class DespesasModule {}
