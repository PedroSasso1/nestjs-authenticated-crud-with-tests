import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Put,
  UseGuards,
  Req,
  HttpException,
} from '@nestjs/common';
import { DespesasService } from './despesas.service';
import { CreateDespesaDto } from './dto/create-despesa.dto';
import { UpdateDespesaDto } from './dto/update-despesa.dto';
import { JwtGuard } from '../auth/auth/jwt.guard';

@Controller('despesas')
export class DespesasController {
  constructor(private readonly despesasService: DespesasService) {}

  @Post()
  @UseGuards(JwtGuard)
  async create(@Body() createDespesaDto: CreateDespesaDto) {
    try {
      const id = await this.despesasService.create(createDespesaDto);
      return { id };
    } catch (error) {
      throw new HttpException(error.message, error['status'] || 500);
    }
  }

  @Get()
  @UseGuards(JwtGuard)
  async findAll(@Req() req: any) {
    return this.despesasService.findAll(req['user']['sub']);
  }

  @Get(':id')
  @UseGuards(JwtGuard)
  async findOne(@Req() req: any, @Param('id') id: string) {
    try {
      const despesa = await this.despesasService.findOne(
        id,
        req['user']['sub'],
      );
      return despesa;
    } catch (error) {
      throw new HttpException(error.message, error['status'] || 500);
    }
  }

  @Put(':id')
  @UseGuards(JwtGuard)
  async update(
    @Req() req: any,
    @Param('id') id: string,
    @Body() updateDespesaDto: UpdateDespesaDto,
  ) {
    try {
      await this.despesasService.update(
        id,
        updateDespesaDto,
        req['user']['sub'],
      );
    } catch (error) {
      throw new HttpException(error.message, error['status'] || 500);
    }
  }

  @Delete(':id')
  @UseGuards(JwtGuard)
  async remove(@Req() req: any, @Param('id') id: string) {
    try {
      await this.despesasService.remove(id, req['user']['sub']);
    } catch (error) {
      throw new HttpException(error.message, error['status'] || 500);
    }
  }
}
