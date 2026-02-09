import { ApiProperty } from '@nestjs/swagger';
import { SignatureTemplateId } from '@src/modules/signatures/entities/signature.entity';

export class SignatureDto {

  constructor(properties: SignatureDto) {
    Object.assign(this, properties);
  }

  @ApiProperty()
  id: number;

  @ApiProperty()
  userId: number;

  @ApiProperty({ enum: SignatureTemplateId })
  templateId: SignatureTemplateId;

  @ApiProperty({
    type: "object",
    additionalProperties: { type: "string" },
    example: {
      fullName: "John Doe",
      email: "john@example.com",
      phone: "+1 234 5678",
    }
  })
  payload: Record<string, string>;

  @ApiProperty({ example: new Date().toISOString() })
  createdAt: string;

  @ApiProperty({ example: new Date().toISOString() })
  updatedAt: string;
}