import { SetMetadata } from '@nestjs/common';
import { UserRole } from 'src/v1/user/entities/user.entity';

export const AuthRoles = (...roles: UserRole[]) => SetMetadata('roles', roles);
