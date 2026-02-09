import { IQueryHandler, Query, QueryHandler } from '@nestjs/cqrs';
import { ClsService } from 'nestjs-cls';
import { BadRequestException, UnauthorizedException } from '@nestjs/common';
import { SignatureDto } from '@src/modules/signatures/dtos/shared/signature.dto';
import {
  GeneratedSignatureResultDtoCacheService
} from '@src/modules/signatures/services/generated-signature-result-dto-cache.service';


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
    private readonly clsService: ClsService,
    private readonly generatedSignatureResultDtoCacheService: GeneratedSignatureResultDtoCacheService
  ) {}

  async execute({ id }: GetGeneratedSignatureQuery): Promise<IGetGeneratedSignatureQueryResult> {
    const accessTokenPayload = this.clsService.get('accessTokenPayload');
    if (!accessTokenPayload)
      throw new UnauthorizedException();

    const result = await this.generatedSignatureResultDtoCacheService.get(id, accessTokenPayload.userId);
    if (!result)
      throw new BadRequestException('Signature not found');

    return result;
  }
}
