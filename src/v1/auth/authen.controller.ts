import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { AuthenticationService } from './authen.service';
import { JwtRefreshAuthGuard } from './guard/jwt-refresh-token.guard';
import { LoginUserDto, RegisterUserDto } from '../user/dto/users.dto';
import { IRequest } from 'src/utils/interface/request.interface';

@Controller()
export class AuthenticationController {
  constructor(private readonly authService: AuthenticationService) {}

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

  @Get('accessToken')
  @UseGuards(JwtRefreshAuthGuard)
  async getAccessToken(@Req() req: IRequest) {
    const data = await this.authService.getAccessToken(req.user);
    return data;
  }
}
