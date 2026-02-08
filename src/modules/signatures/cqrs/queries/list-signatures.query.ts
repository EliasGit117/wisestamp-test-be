import { IQueryHandler, Query, QueryHandler } from '@nestjs/cqrs';
import { PaginatedRequestDto } from '@src/modules/shared/dtos/paginated-request.dto';
import { SignaturesRepository } from '@src/modules/signatures/cqrs/repositories/signatures.repository';
import { ClsService } from 'nestjs-cls';
import { UnauthorizedException } from '@nestjs/common';
import { SignatureDtoFactory } from '@src/modules/signatures/services/signature.dto-factory';
import { PaginatedResultDto } from '@src/modules/shared/dtos/paginated-result.dto';
import { SignatureDto } from '@src/modules/signatures/dtos/shared/signature.dto';


export interface IListSignatureQueryParameters extends PaginatedRequestDto {}

export class ListSignatureQuery extends Query<PaginatedResultDto<SignatureDto>> {
  page?: number;
  limit?: number;

  constructor(properties?: IListSignatureQueryParameters) {
    super();
    Object.assign(this, properties);
  }
}

@QueryHandler(ListSignatureQuery)
export class ListSignatureQueryHandler implements IQueryHandler<ListSignatureQuery, PaginatedResultDto<SignatureDto>> {

  constructor(
    private readonly clsService: ClsService,
    private readonly signaturesRepository: SignaturesRepository,
    private readonly signatureDtoFactory: SignatureDtoFactory,
  ) {}

  async execute(query: ListSignatureQuery): Promise<PaginatedResultDto<SignatureDto>> {
    const accessTokenPayload = this.clsService.get('accessTokenPayload');
    if (!accessTokenPayload)
      throw new UnauthorizedException();

    const res = await this.signaturesRepository.getPaginated(query, { order: { created: 'DESC' } });
    const mappedItems = this.signatureDtoFactory.fromEntities(res.items);

    return { ...res, items: mappedItems };
  }
}
