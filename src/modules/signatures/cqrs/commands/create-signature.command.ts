import { Command, CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { UnauthorizedException } from '@nestjs/common';
import { CreateSignatureRequestDto } from '@src/modules/signatures/dtos/create-signature/create-signature-request.dto';
import { SignatureEntity, SignatureTemplateId } from '@src/modules/signatures/entities/signature.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { SignatureDtoFactory } from '@src/modules/signatures/services/signature.dto-factory';
import { SignatureDto } from '@src/modules/signatures/dtos/shared/signature.dto';
import { ClsService } from 'nestjs-cls';


interface ICreateSignatureCommandProperties extends CreateSignatureRequestDto {}

interface ICreateSignatureCommandResult {
  signature: SignatureDto;
}

export class CreateSignatureCommand extends Command<ICreateSignatureCommandResult> implements ICreateSignatureCommandProperties {
  templateId: SignatureTemplateId;
  payload: Record<string, string>

  constructor(properties: ICreateSignatureCommandProperties) {
    super();
    Object.assign(this, properties);
  }
}

@CommandHandler(CreateSignatureCommand)
export class CreateSignatureCommandHandler implements ICommandHandler<CreateSignatureCommand> {

  constructor(
    @InjectRepository(SignatureEntity) private readonly  signatureRepository: Repository<SignatureEntity>,
    private readonly signatureDtoFactory: SignatureDtoFactory,
    private clsService: ClsService
  ) {}

  async execute({ templateId, payload }: CreateSignatureCommand): Promise<ICreateSignatureCommandResult> {
    const accessTokenPayload = this.clsService.get('accessTokenPayload');
    if (!accessTokenPayload)
      throw new UnauthorizedException();

    const signature = await this.signatureRepository.save({
      userId: accessTokenPayload.userId,
      templateId: templateId,
      payload: payload
    });

    const dto = this.signatureDtoFactory.fromEntity(signature);

    return { signature: dto };
  }
}