import { ITokenPayload } from './interface/token.interface';
import { UUID } from '../../utils/utils';
import {
  forwardRef,
  HttpException,
  Inject,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { UserService } from 'src/v1/user/user.service';
import { LoginUserDto, RegisterUserDto } from '../user/dto/users.dto';
import { User } from '../user/entities/user.entity';
import { CacheService } from 'src/cache/cache.service';
import { IRequestUser } from 'src/utils/interface/request.interface';

@Injectable()
export class AuthenticationService {
  constructor(
    @Inject(forwardRef(() => UserService))
    private usersService: UserService,
    private jwtService: JwtService,
    private readonly configService: ConfigService,
    private cacheService: CacheService,
  ) {}

  async register(dto: RegisterUserDto) {
    const user = await this.usersService.register(dto);
    return user;
  }

  async login(userLogin: LoginUserDto) {
    const user = await this.usersService.login(
      userLogin.idLogin,
      userLogin.password,
    );
    const tokens = await this.generateTokens(user, UUID);

    return { user, tokens };
  }

  async adminLogin(userLogin: LoginUserDto) {
    const user = await this.usersService.adminLogin(
      userLogin.idLogin,
      userLogin.password,
    );
    const tokens = await this.generateTokens(user, UUID);

    return { user, tokens };
  }

  async getAccessToken(user: IRequestUser) {
    try {
      const { userId } = user;
      const uuid = UUID;
      const accessPayload: ITokenPayload = {
        userId: userId,
        sessionId: uuid,
        role: user.role,
      };

      const accessToken = this.jwtService.sign(accessPayload, {
        secret: this.configService.get('jwt.accessTokenSecret'),
        expiresIn: `${this.configService.get(
          'jwt.accessTokenExpirationTime',
        )}s`,
      });

      await this.cacheService.set(
        `at_${uuid}`,
        String(userId),
        this.configService.get<number>('jwt.accessTokenExpirationTime'),
      );

      return { accessToken };
    } catch (error) {
      throw new HttpException(error, error.status);
    }
  }

  async generateTokens(user: User, uuid: string) {
    try {
      const accessPayload: ITokenPayload = {
        userId: user.id,
        sessionId: uuid,
        role: user.role,
      };

      const refreshPayload: ITokenPayload = {
        userId: user.id,
        sessionId: uuid,
        role: user.role,
      };

      const [accessToken, refreshToken] = await Promise.all([
        this.jwtService.sign(accessPayload, {
          secret: this.configService.get('jwt.accessTokenSecret'),
          expiresIn: `${this.configService.get(
            'jwt.accessTokenExpirationTime',
          )}s`,
        }),
        this.jwtService.sign(refreshPayload, {
          secret: this.configService.get('jwt.refreshTokenSecret'),
          expiresIn: `${this.configService.get(
            'jwt.refrestTokenExpirationTime',
          )}s`,
        }),
      ]);
      await Promise.all([
        this.cacheService.set(
          `at_${uuid}`,
          String(user.id),
          this.configService.get<number>('jwt.accessTokenExpirationTime'),
        ),
        this.cacheService.set(
          `rt_${uuid}`,
          String(user.id),
          this.configService.get<number>('jwt.refrestTokenExpirationTime'),
        ),
      ]);

      return { accessToken, refreshToken };
    } catch (error) {
      throw new HttpException(error, error.status);
    }
  }
}
