import {
  Body,
  Controller,
  Get,
  Post,
  Put,
  Req,
  UseGuards,
} from '@nestjs/common';

import { UserService } from './user.service';
import { IRequest } from 'src/utils/interface/request.interface';
import { USER_PERMISSION } from '../auth/permission/permission';
import { Auth } from '../auth/decorator/auth.decorator';
import { UpdateUserDto } from './dto/users.dto';
import { InjectUserToBody } from 'src/utils/decorators/inject-user.decorators';

@Controller('user')
export class UserController {
  constructor(private userService: UserService) {}

  @Put()
  // @InjectUserToBody()
  @Auth(USER_PERMISSION)
  async update(@Body() dto: UpdateUserDto, @Req() req: IRequest) {
    return this.userService.updateUser(dto, req.user);
  }
}
