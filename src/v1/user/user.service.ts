import {
  BadRequestException,
  Inject,
  Injectable,
  NotFoundException,
  forwardRef,
} from '@nestjs/common';
import { compare } from 'bcrypt';
import { BaseService } from 'src/base/base.service';
import { AuthenticationService } from 'src/v1/auth/authen.service';
import { User, UserRole, UserStatus } from './entities/user.entity';
import { UserRepository } from './repositories/user.repository';
import { UpdateUserDto, RegisterUserDto } from './dto/users.dto';
import { IRequestUser } from 'src/utils/interface/request.interface';
import { In } from 'typeorm';
import { ADMIN_PERMISSION } from '../auth/permission/permission';

@Injectable()
export class UserService extends BaseService<User, UserRepository> {
  constructor(
    private readonly repo: UserRepository,
    @Inject(forwardRef(() => AuthenticationService))
    private readonly authenticationService: AuthenticationService,
  ) {
    super(repo);
  }

  async register(dto: RegisterUserDto) {
    const checkUser = await this.repo.findOne({
      where: [
        { email: dto.email, status: UserStatus.Active, role: UserRole.User },
        {
          phoneNumber: dto.phoneNumber,
          status: UserStatus.Active,
          role: UserRole.User,
        },
      ],
    });

    if (checkUser && checkUser.email == dto.email) {
      throw new BadRequestException('EMAIL_EXISTED');
    }

    if (checkUser && checkUser.phoneNumber == dto.phoneNumber) {
      throw new BadRequestException('PHONE_NUMBER_EXISTED');
    }

    if (dto.password !== dto.confirmPassword) {
      throw new BadRequestException('PASSWORD_NOT_MATCH');
    }

    delete dto.confirmPassword;

    return await this.repo.create(dto);
  }

  async login(idLogin: string, password: string): Promise<User> {
    const user = await this._findOne(idLogin);
    if (!user) {
      throw new NotFoundException('ACCOUNT_NOT_REGISTERED');
    }

    const isMatching = await compare(password, user.password);

    if (!isMatching) {
      throw new BadRequestException('WRONG_PASSWORD');
    }

    return user;
  }

  async adminLogin(email: string, password: string): Promise<User> {
    const user = await this.repo.findOne({
      where: {
        email,
        role: In(ADMIN_PERMISSION),
        status: UserStatus.Active,
      },
    });
    if (!user) {
      throw new NotFoundException('ACCOUNT_NOT_REGISTERED');
    }

    const isMatching = await compare(password, user.password);

    if (!isMatching) {
      throw new BadRequestException('WRONG_PASSWORD');
    }

    return user;
  }

  async updateUser(dto: UpdateUserDto, user: IRequestUser) {
    const userUpdate = await this.repo.findOne({
      where: {
        id: user.userId,
        status: UserStatus.Active,
      },
    });
    if (!userUpdate) {
      throw new NotFoundException('USER_NOT_FOUND');
    }

    return this.repo.updateOneAndReturnById(user.userId, dto, null);
  }

  private async _findOne(email: string) {
    return this.repo.findOne({
      where: {
        email,
        role: UserRole.User,
        status: UserStatus.Active,
      },
    });
  }
}
