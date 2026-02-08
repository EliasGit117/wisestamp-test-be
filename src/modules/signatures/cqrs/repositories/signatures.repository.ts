import { Injectable } from '@nestjs/common';
import { GenericRepository } from '@src/modules/shared/repositories/generic.repository';
import { SignatureEntity } from '@src/modules/signatures/entities/signature.entity';
import { DataSource } from 'typeorm';

@Injectable()
export class SignaturesRepository extends GenericRepository<SignatureEntity> {

  constructor(dataSource: DataSource) {
    super(SignatureEntity, dataSource.manager);
  }
}
