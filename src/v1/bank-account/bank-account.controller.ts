import { Body, Controller, Get, Param, Post, Query, Req } from '@nestjs/common';
import { BankAccountService } from './bank-account.service';
import { Auth } from '../auth/decorator/auth.decorator';
import { USER_PERMISSION } from '../auth/permission/permission';
import { IRequest } from 'src/utils/interface/request.interface';
import {
  CreateAccountDto,
  GetAccountDto,
  TransferDto,
  WithdrawDto,
} from './dto/account.dto';

@Controller('bank-account')
export class BankAccountController {
  constructor(private readonly service: BankAccountService) {}

  @Post()
  @Auth(USER_PERMISSION)
  create(@Body() dto: CreateAccountDto, @Req() req: IRequest) {
    return this.service.create(dto, req.user);
  }

  @Post('transfer')
  @Auth(USER_PERMISSION)
  transfer(@Body() dto: TransferDto, @Req() req: IRequest) {
    return this.service.transfer(dto, req.user);
  }

  @Post('withdraw')
  @Auth(USER_PERMISSION)
  withdraw(@Body() dto: WithdrawDto, @Req() req: IRequest) {
    return this.service.withdraw(dto, req.user);
  }

  @Get()
  @Auth(USER_PERMISSION)
  getList(@Req() req: IRequest) {
    return this.service.getList(req.user);
  }

  @Auth(USER_PERMISSION)
  @Get('detail/:id')
  getAccountDetail(@Param('id') id: number, @Req() req: IRequest) {
    return this.service.getAccountDetail(+id, req.user);
  }

  @Auth(USER_PERMISSION)
  @Get('info')
  getAccountInfo(@Query() dto: GetAccountDto, @Req() req: IRequest) {
    return this.service.getAccountInfo(dto, req.user);
  }
}
