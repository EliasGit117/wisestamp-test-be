import { IQueryHandler, Query, QueryHandler } from '@nestjs/cqrs';
import { ClsService } from 'nestjs-cls';
import { UnauthorizedException } from '@nestjs/common';
import { UserDto } from '@src/modules/auth/dtos/shared/user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity, UserStatus } from '@src/modules/auth/entities/user.entity';
import { Repository } from 'typeorm';
import { UserDtoFactory } from '@src/modules/auth/services/user.dto-factory';


export class GetMeQuery extends Query<UserDto> {

  constructor() {
    super();
  }
}

@QueryHandler(GetMeQuery)
export class GetMeQueryHandler implements IQueryHandler<GetMeQuery, UserDto> {

  constructor(
    @InjectRepository(UserEntity) private readonly userRepository: Repository<UserEntity>,
    private readonly clsService: ClsService,
    private readonly userDtoFactory: UserDtoFactory
  ) {
  }

  async execute(_: GetMeQuery): Promise<UserDto> {
    const accessTokenPayload = this.clsService.get('accessTokenPayload');
    if (!accessTokenPayload)
      throw new UnauthorizedException();

    const user = await this.userRepository.findOne({
      where: {
        id: accessTokenPayload.userId,
        status: UserStatus.Active
      }
    });

    if (!user)
      throw new UnauthorizedException();

    return this.userDtoFactory.fromEntity(user);
  }
}
