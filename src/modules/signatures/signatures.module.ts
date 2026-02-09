import { Module } from '@nestjs/common';
import { SignaturesController } from '@src/modules/signatures/controllers/signatures.controller';
import { signaturesCommandHandlers } from '@src/modules/signatures/cqrs/signatures.command-handlers';
import { signaturesQueryHandlers } from '@src/modules/signatures/cqrs/signatures.query-handlers';
import { signaturesServiceProviders } from '@src/modules/signatures/services/signatures-service.providers';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SignatureEntity } from '@src/modules/signatures/entities/signature.entity';
import { SignaturesRepository } from '@src/modules/signatures/cqrs/repositories/signatures.repository';
import { GeneratedSignatureEntity } from '@src/modules/signatures/entities/generated-signature.entity';


@Module({
  imports: [
    TypeOrmModule.forFeature([
      SignatureEntity,
      GeneratedSignatureEntity
    ]),
  ],
  controllers: [SignaturesController],
  providers: [
    ...signaturesCommandHandlers,
    ...signaturesQueryHandlers,
    ...signaturesServiceProviders,
    SignaturesRepository
  ],
})
export class SignaturesModule {
}