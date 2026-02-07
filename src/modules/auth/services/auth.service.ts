import { BadRequestException, Injectable, Logger, UnauthorizedException } from '@nestjs/common';
import { UserEntity, UserStatus } from '@src/modules/auth/entities/user.entity';
import {
  BrowserType,
  DeviceType,
  RefreshTokenEntity,
  RefreshTokenStatus,
} from '@src/modules/auth/entities/refresh-token.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { MoreThan, Repository } from 'typeorm';
import { compare, hash } from 'bcrypt';
import { ClsService } from 'nestjs-cls';
import { UAParser } from 'ua-parser-js';
import { SignUpRequestDto } from '@src/modules/auth/dtos/sign-up/sign-up-request.dto';
import { getDaysAsMs } from '@src/modules/auth/utils/get-days-as-ms';
import { AccessTokenDto } from '@src/modules/auth/dtos/shared/access-token.dto';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { RefreshTokenDto } from '@src/modules/auth/dtos/shared/refresh-token.dto';
import { instanceToPlain } from 'class-transformer';


@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);
  private readonly secretKey: string;

  constructor(
    @InjectRepository(UserEntity) private readonly usersRepository: Repository<UserEntity>,
    @InjectRepository(RefreshTokenEntity) private readonly refreshTokenRepository: Repository<RefreshTokenEntity>,
    private readonly clsService: ClsService,
    private readonly jwtService: JwtService,
    configService: ConfigService,
  ) {
    this.secretKey = configService.getOrThrow<string>('JWT_SECRET');
  }

  async signUp({ email, password, firstName, lastName }: SignUpRequestDto): Promise<UserEntity> {
    this.logger.log({ email }, 'Sign-up attempt started');
    const existsWithSameEmail = await this.usersRepository.exists({ where: { email } });
    if (existsWithSameEmail) {
      this.logger.warn({ email }, 'Sign-up failed, email already taken');
      throw new BadRequestException('Email already taken');
    }

    this.logger.debug({ email }, 'Hashing user password');

    const hashedPassword = await hash(password, 10);

    const user = this.usersRepository.create({
      email,
      firstName,
      lastName,
      status: UserStatus.Active,
      password: hashedPassword,
    });

    this.logger.debug({ email }, 'Saving new user to database');
    await this.usersRepository.save(user);
    this.logger.log({ email, userId: user.id }, 'User successfully registered');

    return user;
  }

  async signIn(email: string, password: string): Promise<{
    user: UserEntity,
    refreshToken: string;
    accessToken: string;
  }> {
    const user = await this.usersRepository.findOne({
      where: { email: email, status: UserStatus.Active },
    });

    if (!user) {
      this.logger.error(`User ${email} not found`);
      throw new BadRequestException('Wrong password or email');
    }

    const isValidPassword = await compare(password, user.password);
    if (!isValidPassword) {
      this.logger.warn(`SignIn failed: wrong password userId=${user.id} email=${email}`);
      throw new BadRequestException('Wrong password or email');
    }

    const ip = this.clsService.get('ip');
    const userAgent = this.clsService.get('userAgent');
    const { deviceType, browserType } = this.parseUserAgent(userAgent);

    const refreshToken = await this.refreshTokenRepository.save({
      expires: new Date(Date.now() + getDaysAsMs(14)),
      user: user,
      ipAddress: ip,
      browserType: browserType,
      deviceType: deviceType,
      userAgent: userAgent,
    });

    const {
      accessToken: accessTokenDto,
      refreshToken: refreshTokenDto,
    } = await this.createTokenDtos(user.id, refreshToken.id);

    return { user: user, refreshToken: refreshTokenDto, accessToken: accessTokenDto };
  }

  async createTokenDtos(userId: number, refreshTokenId: string): Promise<{
    accessToken: string,
    refreshToken: string
  }> {
    const refreshToken = await this.createRefreshTokenDto(refreshTokenId, userId);
    const refreshTokenEntity = await this.refreshTokenRepository.findOne({
      where: {
        id: refreshTokenId,
        status: RefreshTokenStatus.Active,
        expires: MoreThan(new Date())
      },
    });
    if (!refreshTokenEntity)
      throw new UnauthorizedException();

    const accessToken = await this.createAccessTokenDto(refreshTokenEntity);
    return { accessToken, refreshToken };
  }

  async createRefreshTokenDto(id: string, userId: number): Promise<string> {
    const payload = new RefreshTokenDto({ id: id, ver: 0.01, userId: userId });
    return this.jwtService.sign(instanceToPlain(payload), { secret: this.secretKey, expiresIn: '14d' });
  }

  async createAccessTokenDto(refreshToken: RefreshTokenEntity): Promise<string> {
    const user = await this.usersRepository.findOne({ where: { id: refreshToken.userId } });
    if (!user)
      throw new UnauthorizedException();

    const payload = new AccessTokenDto({
      ver: 0.01,
      userId: user.id,
      refreshTokenId: refreshToken.id,
      userStatus: user.status,
      role: user.role,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
    });

    return this.jwtService.sign(instanceToPlain(payload), { secret: this.secretKey, expiresIn: '7d' });
  }

  private parseUserAgent(userAgent?: string): { browserType: BrowserType; deviceType: DeviceType; } {
    if (!userAgent)
      return { browserType: BrowserType.Unknown, deviceType: DeviceType.Unknown };

    const ua = new UAParser(userAgent).getResult();

    let deviceType = DeviceType.Desktop;

    if (ua.device.type === 'mobile')
      deviceType = DeviceType.Mobile;

    if (ua.device.type === 'tablet')
      deviceType = DeviceType.Tablet;

    let browserType: BrowserType = BrowserType.Unknown;

    switch (ua.browser.name) {
      case 'Chrome':
        browserType = deviceType === DeviceType.Mobile ?
          BrowserType.ChromeMobile :
          BrowserType.Chrome;
        break;

      case 'Safari':
      case 'Mobile Safari':
        browserType = deviceType === DeviceType.Mobile ?
          BrowserType.SafariMobile :
          BrowserType.Safari;
        break;

      case 'Firefox':
        browserType =
          deviceType === DeviceType.Mobile ?
            BrowserType.FirefoxMobile :
            BrowserType.Firefox;
        break;

      case 'Samsung Internet':
        browserType = BrowserType.SamsungInternet;
        break;

      default:
        browserType = BrowserType.Unknown;
    }

    return { browserType, deviceType };
  }
}