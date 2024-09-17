import {
  Body,
  Controller,
  Get,
  InternalServerErrorException,
  Put,
  Req,
  Res,
} from '@nestjs/common';

import { UserService } from './user.service';
import { IRequest } from 'src/utils/interface/request.interface';
import { USER_PERMISSION } from '../auth/permission/permission';
import { Auth } from '../auth/decorator/auth.decorator';
import { UpdateUserDto } from './dto/users.dto';
import { Response as ResponseExpress } from 'express';

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

  @Get('convert-pdf')
  // @Auth(USER_PERMISSION)
  async convertPdfToImage(@Res() res: ResponseExpress) {
    try {
      const allPagesText = await this.userService.convertPdfToImage();
      // Set the appropriate headers
      res.setHeader('Content-Type', 'application/json');

      // Send all pages' text
      return res.json({
        extractedText: allPagesText,
      });
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }
}
