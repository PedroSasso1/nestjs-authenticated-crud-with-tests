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
} from '@nestjs/common';
import { ExpensesService } from './expense.service';
import { CreateExpenseDto } from './dto/create-expense.dto';
import { UpdateExpenseDto } from './dto/update-expense.dto';
import { JwtGuard } from '../auth/auth/jwt.guard';

@Controller('expenses')
export class ExpensesController {
  constructor(private readonly expensesService: ExpensesService) {}

  @Post()
  @UseGuards(JwtGuard)
  async create(@Body() createExpenseDto: CreateExpenseDto) {
    const id = await this.expensesService.create(createExpenseDto);
    return { id };
  }

  @Get()
  @UseGuards(JwtGuard)
  async findAll(@Req() req: any) {
    return this.expensesService.findAll(req['user']['sub']);
  }

  @Get(':id')
  @UseGuards(JwtGuard)
  async findOne(@Req() req: any, @Param('id') id: string) {
    const expense = await this.expensesService.findOne(id, req['user']['sub']);
    return expense;
  }

  @Put(':id')
  @UseGuards(JwtGuard)
  async update(
    @Req() req: any,
    @Param('id') id: string,
    @Body() updateExpenseDto: UpdateExpenseDto,
  ) {
    await this.expensesService.update(id, updateExpenseDto, req['user']['sub']);
  }

  @Delete(':id')
  @UseGuards(JwtGuard)
  async remove(@Req() req: any, @Param('id') id: string) {
    await this.expensesService.remove(id, req['user']['sub']);
  }
}
