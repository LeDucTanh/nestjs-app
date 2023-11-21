import { Controller, Get } from '@nestjs/common';
import { PersonalColorService } from './personal-color.service';
import { Auth } from '../auth/decorator/auth.decorator';
import { ANY_PERMISSION } from '../auth/permission/permission';

@Controller('personal-color')
export class PersonalColorController {
  constructor(private readonly personalColorService: PersonalColorService) {}

  @Get()
  @Auth(ANY_PERMISSION)
  findAll() {
    return this.personalColorService.findAll();
  }
}
