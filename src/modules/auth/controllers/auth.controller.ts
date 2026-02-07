import { Body, Controller, Get, Post, Res, UseGuards } from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiCreatedResponse,
  ApiInternalServerErrorResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { SignUpResultDto } from '@src/modules/auth/dtos/sign-up/sign-up-result';
import { SignInResultDto } from '@src/modules/auth/dtos/sign-in/sign-in-result.dto';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import type { FastifyReply } from 'fastify';
import { SignInCommand } from '@src/modules/auth/cqrs/commands/sign-in.command';
import { SignInRequestDto } from '@src/modules/auth/dtos/sign-in/sign-in-request.dto';
import { SignUpRequestDto } from '@src/modules/auth/dtos/sign-up/sign-up-request.dto';
import { SignUpCommand } from '@src/modules/auth/cqrs/commands/sign-up.command';
import { CookieSerializeOptions } from '@fastify/cookie';
import { getDaysAsMs } from '@src/modules/auth/utils/get-days-as-ms';
import { AuthKey } from '@src/modules/auth/enums/auth-key.enum';
import { UserDto } from '@src/modules/auth/dtos/shared/user.dto';
import { AccessTokenGuard } from '@src/modules/auth/guards/access-token.guard';
import { RefreshTokenGuard } from '@src/modules/auth/guards/refresh-token.guard';
import { RefreshTokenCommand } from '@src/modules/auth/cqrs/commands/refresh-token.command';
import { GetMeQuery } from '@src/modules/auth/cqrs/queries/get-me.query';


@ApiTags('Authentication')
@Controller('auth')
export class AuthController {
  private readonly accessTokenCookieOptions: CookieSerializeOptions;
  private readonly refreshTokenCookieOptions: CookieSerializeOptions;

  constructor(
    private readonly queryBus: QueryBus,
    private readonly commandBus: CommandBus
  ) {
    const sharedCookieOptions: CookieSerializeOptions = {
      domain: 'localhost',
      sameSite: 'none',
      httpOnly: true,
      secure: true,
      path: '/',
    };

    this.accessTokenCookieOptions = { ...sharedCookieOptions, expires: new Date(Date.now() + getDaysAsMs(7)) };
    this.refreshTokenCookieOptions = { ...sharedCookieOptions, expires: new Date(Date.now() + getDaysAsMs(14)) };
  }


  @Get('me')
  @UseGuards(AccessTokenGuard)
  @ApiUnauthorizedResponse()
  @ApiOkResponse({ type: UserDto })
  @ApiOperation({ summary: 'Get me' })
  async getMe(): Promise<UserDto> {
    return this.queryBus.execute(new GetMeQuery());
  }

  @Get("refresh")
  @UseGuards(RefreshTokenGuard)
  @ApiOkResponse({ type: UserDto })
  @ApiOperation({ summary: 'Refresh token', description: 'Refresh access token using refresh token' })
  async refreshToken(@Res({ passthrough: true }) res: FastifyReply): Promise<UserDto> {
    const { accessToken, user } = await this.commandBus.execute(new RefreshTokenCommand());
    res.setCookie(AuthKey.AccessToken, accessToken, this.accessTokenCookieOptions);

    return user;
  }

  @Post('sign-in')
  @ApiBadRequestResponse()
  @ApiInternalServerErrorResponse()
  @ApiCreatedResponse({ type: SignInResultDto })
  @ApiOperation({ summary: 'Sign in', description: 'Sign in using email and password' })
  async signIn(@Body() body: SignInRequestDto, @Res({ passthrough: true }) res: FastifyReply): Promise<SignInResultDto> {
    const result = await this.commandBus.execute(new SignInCommand(body));

    res.setCookie(AuthKey.AccessToken, result.accessToken, this.accessTokenCookieOptions);
    res.setCookie(AuthKey.RefreshToken, result.refreshToken, this.refreshTokenCookieOptions);

    return { user: result.user };
  }

  @Post('sign-up')
  @ApiBadRequestResponse()
  @ApiInternalServerErrorResponse()
  @ApiCreatedResponse({ type: SignUpResultDto })
  @ApiOperation({ summary: 'Sign up', description: 'Sign up using email and password' })
  async signUp(@Body() body: SignUpRequestDto, @Res({ passthrough: true }) res: FastifyReply): Promise<SignUpResultDto> {
    return await this.commandBus.execute(new SignUpCommand(body));
  }
}