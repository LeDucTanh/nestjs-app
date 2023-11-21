import { UserRole } from 'src/v1/user/entities/user.entity';

export const SUPER_ADMIN_PERMISSION = [UserRole.SuperAdmin];

export const ADMIN_PERMISSION = [UserRole.Admin, UserRole.SuperAdmin];

export const ANY_PERMISSION = [UserRole.Any];

export const USER_PERMISSION = [UserRole.User];

export const ONLY_ADMIN_PERMISSION = [UserRole.Admin];
