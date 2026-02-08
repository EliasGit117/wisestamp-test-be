import { SignatureDto } from '@src/modules/signatures/dtos/shared/signature.dto';
import { ApiProperty } from '@nestjs/swagger';

export class CreateSignatureResultDto {

  @ApiProperty({ type: SignatureDto })
  signature: SignatureDto;
}