import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { Request } from 'express';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ITokenPayload } from '../interface/token.interface';
import { IRequestUser } from 'src/utils/interface/request.interface';
import { CacheService } from 'src/cache/cache.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
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
          return '';
        },
      ]),
      secretOrKey: configService.get('jwt.accessTokenSecret'),
    });
  }

  async validate(payload: ITokenPayload): Promise<IRequestUser> {
    const { userId, sessionId, role } = payload;
    if (!userId) {
      throw new UnauthorizedException();
    }

    const cache = await this.cacheService.get(`at_${sessionId}`);

    if (!cache) {
      throw new UnauthorizedException();
    }

    return {
      userId,
      sessionId,
      role,
    };
  }
}
