import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { FastifyRequest } from "fastify";
import { RefreshTokenDto } from '@src/modules/auth/dtos/shared/refresh-token.dto';
import { extractFromCookies } from '@src/modules/auth/utils/extract-from-cookies';
import { extractFromHeader } from '@src/modules/auth/utils/extract-from-header';
import { AuthKey } from '@src/modules/auth/enums/auth-key.enum';
import { ClsService } from 'nestjs-cls';


@Injectable()
export class RefreshTokenStrategy extends PassportStrategy(Strategy, 'refresh-token-strategy') {

  constructor(
    configService: ConfigService,
    private readonly clsService: ClsService
  ) {
    super({
      secretOrKey: configService.getOrThrow<string>('JWT_SECRET'),
      jwtFromRequest: ExtractJwt.fromExtractors([
        (request: FastifyRequest) => extractFromCookies(request, AuthKey.RefreshToken),
        (request: FastifyRequest) => extractFromHeader(request, AuthKey.RefreshToken),
      ]),
    });
  }

  async validate(payload: RefreshTokenDto) {
    this.clsService.set('refreshTokenPayload', payload);
    return payload;
  }
}
