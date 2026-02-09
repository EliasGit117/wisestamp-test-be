import { Injectable } from "@nestjs/common";
import { UserDto } from '@src/modules/auth/dtos/shared/user.dto';
import { UserEntity } from '@src/modules/auth/entities/user.entity';


@Injectable()
export class UserDtoFactory {

  fromEntity(user: UserEntity): UserDto {

    return new UserDto({
      id: user.id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      status: user.status,
      role: user.role,
      createdAt: user.createdAt.toISOString(),
      updatedAt: user.updatedAt.toISOString(),
    })
  }

  fromEntities(entities: UserEntity[]): UserDto[] {
    return entities.map(entity => this.fromEntity(entity));
  }
}