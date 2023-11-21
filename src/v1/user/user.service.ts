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
    private readonly usersRepository: UserRepository,
    @Inject(forwardRef(() => AuthenticationService))
    private readonly authenticationService: AuthenticationService,
  ) {
    super(usersRepository);
  }

  async register(dto: RegisterUserDto) {
    let user = await this.usersRepository.findOne({
      select: {
        id: true,
      },
      where: {
        username: dto.username,
        role: UserRole.User,
        status: UserStatus.Active,
      },
    });

    if (user) {
      throw new BadRequestException('USERNAME_EXISTED');
    }

    user = await this.findIdLogin(dto.idLogin);

    if (user) {
      throw new BadRequestException('ID_LOGIN_EXISTED');
    }

    const [email, phoneNumber] = await Promise.all([
      this.findEmail(dto.email),
      this.findPhoneNumber(dto.phoneNumber),
    ]);

    if (email) {
      throw new BadRequestException('EMAIL_EXISTED');
    }

    if (phoneNumber) {
      throw new BadRequestException('PHONE_NUMBER_EXISTED');
    }

    if (dto.password !== dto.confirmPassword) {
      throw new BadRequestException('PASSWORD_NOT_MATCH');
    }

    delete dto.confirmPassword;

    user = await this.usersRepository.create(dto);

    await this.usersRepository.save(user);

    return user;
  }

  async login(idLogin: string, password: string): Promise<User> {
    const user = await this.findIdLogin(idLogin);
    if (!user) {
      throw new NotFoundException('ACCOUNT_NOT_REGISTERED');
    }

    const isMatching = await compare(password, user.password);

    if (!isMatching) {
      throw new BadRequestException('WRONG_PASSWORD');
    }

    return user;
  }

  async adminLogin(idLogin: string, password: string): Promise<User> {
    const user = await this.usersRepository.findOne({
      where: {
        idLogin,
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
    const userUpdate = await this.usersRepository.findOne({
      where: {
        id: user.userId,
        status: UserStatus.Active,
      },
    });
    if (!userUpdate) {
      throw new NotFoundException('USER_NOT_FOUND');
    }

    return this.usersRepository.updateOneAndReturnById(user.userId, dto, null);
  }

  private async findIdLogin(idLogin: string) {
    return this.usersRepository.findOne({
      where: {
        idLogin,
        role: UserRole.User,
        status: UserStatus.Active,
      },
    });
  }

  private async findEmail(email: string) {
    return this.usersRepository.findOne({
      select: {
        id: true,
      },
      where: {
        email,
        role: UserRole.User,
        status: UserStatus.Active,
      },
    });
  }

  private async findPhoneNumber(phoneNumber: string) {
    return this.usersRepository.findOne({
      select: {
        id: true,
      },
      where: {
        phoneNumber,
        role: UserRole.User,
        status: UserStatus.Active,
      },
    });
  }
}
