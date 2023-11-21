import { Body, Controller, Get, Put, Req } from '@nestjs/common';

import { UserService } from './user.service';
import { IRequest } from 'src/utils/interface/request.interface';
import { USER_PERMISSION } from '../auth/permission/permission';
import { Auth } from '../auth/decorator/auth.decorator';
import { UpdateUserDto } from './dto/users.dto';

@Controller('user')
export class UserController {
  constructor(private userService: UserService) {}

  @Put()
  @Auth(USER_PERMISSION)
  async update(@Body() dto: UpdateUserDto, @Req() req: IRequest) {
    return this.userService.updateUser(dto, req.user);
  }

  @Get('me')
  @Auth(USER_PERMISSION)
  getMe(@Req() req: IRequest) {
    return this.userService.getMe(req.user);
  }
}
