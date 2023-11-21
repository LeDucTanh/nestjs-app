import { UserRole } from 'src/v1/user/entities/user.entity';

export interface ITokenPayload {
  userId: number;
  sessionId: string;
  role: UserRole;
}

export interface IVerifyInfo {
  socialId: string;
  email: string;
}
