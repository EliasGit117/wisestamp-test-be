import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { FastifyRequest } from "fastify";
import { AccessTokenDto } from '@src/modules/auth/dtos/shared/access-token.dto';
import { AuthKey } from '@src/modules/auth/enums/auth-key.enum';
import { extractFromCookies } from '@src/modules/auth/utils/extract-from-cookies';
import { extractFromHeader } from '@src/modules/auth/utils/extract-from-header';
import { ClsService } from 'nestjs-cls';

@Injectable()
export class AccessTokenStrategy extends PassportStrategy(Strategy, 'access-token-strategy') {

  constructor(
    private readonly configService: ConfigService,
    private readonly clsService: ClsService
  ) {
    super({
      secretOrKey: configService.getOrThrow<string>('JWT_SECRET'),
      jwtFromRequest: ExtractJwt.fromExtractors([
        (request: FastifyRequest) => extractFromCookies(request, AuthKey.AccessToken),
        (request: FastifyRequest) => extractFromHeader(request, AuthKey.AccessToken),
      ]),
    });
  }

  async validate(payload: AccessTokenDto) {
    this.clsService.set('accessTokenPayload', payload);
    return payload;
  }
}
