import { Controller, Get } from '@nestjs/common';
import { MakeupTypeService } from './makeup-type.service';
import { ANY_PERMISSION } from '../auth/permission/permission';
import { Auth } from '../auth/decorator/auth.decorator';

@Controller('makeup-type')
export class MakeupTypeController {
  constructor(private readonly makeupTypeService: MakeupTypeService) {}

  @Get()
  @Auth(ANY_PERMISSION)
  findAll() {
    return this.makeupTypeService.findAll();
  }
}
