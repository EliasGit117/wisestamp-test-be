import { Injectable } from '@nestjs/common';
import { InMemoryCacheService } from '@src/modules/shared/services/in-memory-cache.service';
import { InjectRepository } from '@nestjs/typeorm';
import { SignatureEntity, SignatureTemplateId } from '@src/modules/signatures/entities/signature.entity';
import { Repository } from 'typeorm';
import {
  GetGeneratedSignatureResultDto,
} from '@src/modules/signatures/dtos/get-generated-signature/get-generated-signature-result.dto';
import { SignatureGeneratorService } from '@src/modules/signatures/services/signature-generator.service';
import { SignatureDtoFactory } from '@src/modules/signatures/services/signature.dto-factory';


@Injectable()
export class GeneratedSignatureResultDtoCacheService {
  private readonly key: string = 'generated_signature_dto';
  private readonly ttlMs: number = 60 * 1000 * 5;

  constructor(
    @InjectRepository(SignatureEntity) private readonly signaturesRepository: Repository<SignatureEntity>,
    private readonly cache: InMemoryCacheService<GetGeneratedSignatureResultDto>,
    private readonly signatureGeneratorService: SignatureGeneratorService,
    private readonly signatureDtoFactory: SignatureDtoFactory,
  ) {}

  async get(id: number, userId: number): Promise<GetGeneratedSignatureResultDto | undefined> {
    const dtoFromCache = this.cache.get(`${this.key}:${id}`);
    if (dtoFromCache != null)
      return dtoFromCache;

    const entity = await this.signaturesRepository.findOne({ where: { id: id, userId: userId } });
    if (entity == null)
      return undefined;

    return this.createDtoAndSave(entity);
  }

  createDtoAndSave(signatureEntity: SignatureEntity): GetGeneratedSignatureResultDto {
    const html = this.signatureGeneratorService.generateHtml(signatureEntity.templateId, signatureEntity.payload);
    const text = this.signatureGeneratorService.generateText(signatureEntity.payload);
    const signatureDto = this.signatureDtoFactory.fromEntity(signatureEntity);
    const result: GetGeneratedSignatureResultDto = { signature: signatureDto, html: html, text: text };

    this.cache.set(`${this.key}:${signatureEntity.id}`, result, this.ttlMs);

    return  { signature: signatureDto, html: html, text: text };
  }

}