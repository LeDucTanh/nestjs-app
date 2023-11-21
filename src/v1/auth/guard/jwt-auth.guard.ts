import {
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  canActivate(context: ExecutionContext) {
    return super.canActivate(context);
  }

  handleRequest(err, jwtDecode, info) {
    if (err || !jwtDecode) {
      throw err || new UnauthorizedException();
    }

    console.log('jwtDecode', jwtDecode);
    return jwtDecode;
  }
}
