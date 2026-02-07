import { Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { UserEntity } from '@src/modules/auth/entities/user.entity';
import { GenericRepository } from '@src/modules/shared/repositories/generic.repository';

@Injectable()
export class UsersRepository extends GenericRepository<UserEntity> {

  constructor(dataSource: DataSource) {
    super(UserEntity, dataSource.manager);
  }
}
