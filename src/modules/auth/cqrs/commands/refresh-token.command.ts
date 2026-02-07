import { Command, CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { Logger, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { RefreshTokenEntity, RefreshTokenStatus } from '@src/modules/auth/entities/refresh-token.entity';
import { MoreThan, Repository } from 'typeorm';
import { ClsService } from 'nestjs-cls';
import { AuthService } from '@src/modules/auth/services/auth.service';
import { UserDto } from '@src/modules/auth/dtos/shared/user.dto';
import { UserDtoFactory } from '@src/modules/auth/services/user.dto-factory';


interface IRefreshTokenCommandProperties {
}

interface IRefreshTokenCommandResult {
  user: UserDto;
  accessToken: string;
}

export class RefreshTokenCommand extends Command<IRefreshTokenCommandResult> implements IRefreshTokenCommandProperties {

  constructor() {
    super();
  }
}

@CommandHandler(RefreshTokenCommand)
export class RefreshTokenCommandHandler implements ICommandHandler<RefreshTokenCommand> {
  private readonly logger = new Logger(RefreshTokenCommand.name);

  constructor(
    @InjectRepository(RefreshTokenEntity) private readonly refreshTokenRepository: Repository<RefreshTokenEntity>,
    private readonly clsService: ClsService,
    private readonly authService: AuthService,
    private readonly userDtoFactory: UserDtoFactory
  ) {
  }

  async execute(command: RefreshTokenCommand): Promise<IRefreshTokenCommandResult> {
    const refreshToken = this.clsService.get('refreshTokenPayload');
    if (!refreshToken)
      throw new UnauthorizedException();

    const refreshTokenEntity = await this.refreshTokenRepository.findOne({
      relations: { user: true },
      where: {
        id: refreshToken.id,
        status: RefreshTokenStatus.Active,
        expires: MoreThan(new Date()),
      }
    });

    if (!refreshTokenEntity)
      throw new UnauthorizedException();

    const accessToken = await this.authService.createAccessTokenDto(refreshTokenEntity);
    const userDto = this.userDtoFactory.fromEntity(refreshTokenEntity.user);

    return {
      accessToken: accessToken,
      user: userDto
    }
  }
}