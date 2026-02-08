import { ApiProperty } from '@nestjs/swagger';
import { SignatureDto } from '@src/modules/signatures/dtos/shared/signature.dto';

export class GetGeneratedSignatureResultDto {

  @ApiProperty({ type: SignatureDto })
  signature: SignatureDto;

  @ApiProperty({ description: 'Generated signature in text form' })
  text: string;

  @ApiProperty({ description: 'Generated signature in html form' })
  html: string;
}