import { UserRole } from 'src/v1/user/entities/user.entity';

export interface IRequestUser {
  userId: number;
  sessionId: string;
  role: UserRole;
}

export interface IRequest {
  user: IRequestUser;
}
