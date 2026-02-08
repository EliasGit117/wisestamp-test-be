import { IQueryHandler, Query, QueryHandler } from '@nestjs/cqrs';
import { ClsService } from 'nestjs-cls';
import { BadRequestException, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { SignatureDto } from '@src/modules/signatures/dtos/shared/signature.dto';
import { SignatureEntity, SignatureTemplateId } from '@src/modules/signatures/entities/signature.entity';
import { SignatureDtoFactory } from '@src/modules/signatures/services/signature.dto-factory';
import { SignatureGeneratorService } from '@src/modules/signatures/services/signature-generator.service';


export interface IGetGeneratedSignatureQueryResult {
  signature: SignatureDto;
  html: string;
  text: string;
}

export class GetGeneratedSignatureQuery extends Query<IGetGeneratedSignatureQueryResult> {
  id: number;

  constructor(id: number) {
    super();
    this.id = id;
  }
}

@QueryHandler(GetGeneratedSignatureQuery)
export class GetGeneratedSignatureQueryHandler implements IQueryHandler<GetGeneratedSignatureQuery, IGetGeneratedSignatureQueryResult> {

  constructor(
    @InjectRepository(SignatureEntity) private readonly signaturesRepository: Repository<SignatureEntity>,
    private readonly clsService: ClsService,
    private readonly signatureGeneratorService: SignatureGeneratorService,
    private readonly signatureDtoFactory: SignatureDtoFactory,
  ) {
  }

  async execute({ id }: GetGeneratedSignatureQuery): Promise<IGetGeneratedSignatureQueryResult> {
    const accessTokenPayload = this.clsService.get('accessTokenPayload');
    if (!accessTokenPayload)
      throw new UnauthorizedException();

    const signature = await this.signaturesRepository.findOne({
      where: {
        id: id,
        userId: accessTokenPayload.userId,
      }
    });

    if (!signature)
      throw new BadRequestException('Signature not found');

    const html = this.signatureGeneratorService.generateHtml(SignatureTemplateId.SimpleGreen, signature.payload);
    const text = this.signatureGeneratorService.generateText(signature.payload);
    const dto = this.signatureDtoFactory.fromEntity(signature);

    return { signature: dto, html, text };
  }
}
