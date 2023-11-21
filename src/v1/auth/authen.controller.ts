import {
  Body,
  Controller,
  Get,
  HttpCode,
  Param,
  ParseIntPipe,
  Post,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { Response } from 'express';
import { UserService } from '../user/user.service';
import { AuthenticationService } from './authen.service';
import { JwtRefreshAuthGuard } from './guard/jwt-refresh-token.guard';
import { LoginUserDto, RegisterUserDto } from '../user/dto/users.dto';
import { JwtAuthGuard } from './guard/jwt-auth.guard';
import { IRequest } from 'src/utils/interface/request.interface';

@Controller()
export class AuthenticationController {
  constructor(
    private readonly authService: AuthenticationService, // private readonly usersService: UserService,
  ) {}

  @Post('register')
  async register(@Body() dto: RegisterUserDto) {
    const data = await this.authService.register(dto);
    return data;
  }

  @Post('login')
  async login(@Body() userLoginDto: LoginUserDto) {
    const data = await this.authService.login(userLoginDto);
    return data;
  }

  // @Get('/detail/:id')
  // @UseGuards(JwtAuthGuard)
  // async getUserDetail(@Param('id', ParseIntPipe) id: number) {
  //   const data = await this.authService.findOne(id);
  //   return data;
  // }

  @Get('accessToken')
  @UseGuards(JwtRefreshAuthGuard)
  async getAccessToken(@Req() req: IRequest) {
    const data = await this.authService.getAccessToken(req.user);
    return data;
  }
}
