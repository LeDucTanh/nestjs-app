import { applyDecorators, UseGuards } from '@nestjs/common';
import { UserRole } from 'src/v1/user/entities/user.entity';
import { RolesGuard } from '../guard/role.guard';
import { AuthRoles } from './role.decorator';
import { JwtAuthGuard } from '../guard/jwt-auth.guard';

export function Auth(role?: UserRole | UserRole[]) {
  let roles = [];
  if (typeof role === 'string') roles = [role];
  else roles = role;
  return applyDecorators(
    AuthRoles(...roles),
    UseGuards(JwtAuthGuard, RolesGuard),
  );
}
