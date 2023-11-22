import { Controller, Get, Query, Req } from '@nestjs/common';
import { TransactionService } from './transaction.service';
import { Auth } from '../auth/decorator/auth.decorator';
import { USER_PERMISSION } from '../auth/permission/permission';
import { TransactionDto } from './dto/transaction.dto';
import { IRequest } from 'src/utils/interface/request.interface';

@Controller('transaction')
export class TransactionController {
  constructor(private readonly service: TransactionService) {}

  @Get()
  @Auth(USER_PERMISSION)
  getList(@Query() dto: TransactionDto, @Req() request: IRequest) {
    return this.service.getList(dto, request.user);
  }
}
