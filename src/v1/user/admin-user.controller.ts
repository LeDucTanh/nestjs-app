import { Body, Controller, Post } from '@nestjs/common';
import { UserService } from './user.service';
import { AuthenticationService } from '../auth/authen.service';
import { LoginUserDto } from './dto/users.dto';

@Controller('admin')
export class AdminUserController {
  constructor(
    private userService: UserService,
    private authService: AuthenticationService,
  ) {}

  @Post('login')
  adminLogin(@Body() userLoginDto: LoginUserDto) {
    return this.authService.adminLogin(userLoginDto);
  }
}
