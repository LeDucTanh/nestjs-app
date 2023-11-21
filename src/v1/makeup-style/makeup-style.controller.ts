import { Controller, Get } from '@nestjs/common';
import { MakeupStyleService } from './makeup-style.service';
import { Auth } from '../auth/decorator/auth.decorator';
import { ANY_PERMISSION } from '../auth/permission/permission';

@Controller('makeup-style')
export class MakeupStyleController {
  constructor(private readonly makeupStyleService: MakeupStyleService) {}

  @Get()
  @Auth(ANY_PERMISSION)
  findAll() {
    return this.makeupStyleService.findAll();
  }
}
