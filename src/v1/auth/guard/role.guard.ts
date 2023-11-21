import { Request } from 'express';

import {
  CanActivate,
  ExecutionContext,
  HttpException,
  HttpStatus,
  Injectable,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { UserRole } from 'src/v1/user/entities/user.entity';
import { IRequest } from 'src/utils/interface/request.interface';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    let roles: any = this.reflector.get<string[]>(
      'roles',
      context.getHandler(),
    );
    if (!roles) {
      return true;
    }

    if (typeof roles[0] === 'object') roles = roles[0];

    const request: IRequest = context.switchToHttp().getRequest();

    const user = request.user;

    if (roles.includes(UserRole.Any)) {
      return true;
    }

    const isAuthorized = roles.includes(user.role);

    if (!isAuthorized) {
      throw new HttpException('Forbidden', HttpStatus.FORBIDDEN);
    }

    return true;
  }
}
