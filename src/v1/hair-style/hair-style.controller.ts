import { Controller, Get } from '@nestjs/common';
import { HairStyleService } from './hair-style.service';
import { ANY_PERMISSION } from '../auth/permission/permission';
import { Auth } from '../auth/decorator/auth.decorator';

@Controller('hair-style')
export class HairStyleController {
  constructor(private readonly hairStyleService: HairStyleService) {}

  @Get()
  @Auth(ANY_PERMISSION)
  findAll() {
    return this.hairStyleService.findAll();
  }
}
