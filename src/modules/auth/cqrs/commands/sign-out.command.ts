import { Command, CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { RefreshTokenEntity, RefreshTokenStatus } from '@src/modules/auth/entities/refresh-token.entity';
import { Repository } from 'typeorm';
import { ClsService } from 'nestjs-cls';


export class SignOutCommand extends Command<void> {
}

@CommandHandler(SignOutCommand)
export class SignOutCommandHandler implements ICommandHandler<SignOutCommand> {

  constructor(
    @InjectRepository(RefreshTokenEntity) private readonly refreshTokensRepository: Repository<RefreshTokenEntity>,
    private readonly clsService: ClsService,
  ) {
  }

  async execute(_: SignOutCommand): Promise<void> {
    const accessToken = this.clsService.get('accessTokenPayload');
    if (!accessToken)
      throw new UnauthorizedException();

    await this.refreshTokensRepository.update({ id: accessToken.refreshTokenId }, {
      status: RefreshTokenStatus.Revoked
    });
  }
}