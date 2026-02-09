import { Injectable } from "@nestjs/common";
import { SignatureEntity } from '@src/modules/signatures/entities/signature.entity';
import { SignatureDto } from '@src/modules/signatures/dtos/shared/signature.dto';


@Injectable()
export class SignatureDtoFactory {

  fromEntity(entity: SignatureEntity): SignatureDto {

    return new SignatureDto({
      id: entity.id,
      templateId: entity.templateId,
      userId: entity.userId,
      payload: entity.payload,
      createdAt: entity.createdAt.toISOString(),
      updatedAt: entity.updatedAt.toISOString(),
    })
  }

  fromEntities(entities: SignatureEntity[]): SignatureDto[] {
    return entities.map(entity => this.fromEntity(entity));
  }
}