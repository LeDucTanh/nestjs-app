import { ForbiddenException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { Request } from 'express';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ITokenPayload } from '../interface/token.interface';
import { IRequestUser } from 'src/utils/interface/request.interface';
import { CacheService } from 'src/cache/cache.service';

@Injectable()
export class JwtRefreshTokenStrategy extends PassportStrategy(
  Strategy,
  'jwt-refresh-token',
) {
  constructor(
    private readonly configService: ConfigService,
    private readonly cacheService: CacheService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        (request: Request) => {
          let authorization = request?.headers?.authorization;
          if (authorization) {
            return authorization.replace('Bearer ', '');
          }
        },
      ]),
      secretOrKey: configService.get('jwt.refreshTokenSecret'),
      passReqToCallback: true,
    });
  }

  async validate(
    request: Request,
    payload: ITokenPayload,
  ): Promise<IRequestUser> {
    const { userId, sessionId, role } = payload;
    if (!userId) {
      throw new ForbiddenException();
    }

    const cache = await this.cacheService.get(`rt_${sessionId}`);

    if (!cache) {
      throw new ForbiddenException();
    }

    return {
      userId,
      sessionId,
      role,
    };
  }
}
