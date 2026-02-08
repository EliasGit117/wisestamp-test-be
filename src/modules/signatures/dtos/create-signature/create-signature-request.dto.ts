import { ApiProperty } from '@nestjs/swagger';
import { SignatureTemplateId } from '@src/modules/signatures/entities/signature.entity';
import {
  IsEnum,
  Validate,
  ValidationArguments,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';


@ValidatorConstraint({ name: "StringRecord", async: false })
export class StringRecordValidator implements ValidatorConstraintInterface {
  validate(value: unknown): boolean {
    if (typeof value !== "object" || value === null)
      return false;

    return Object.values(value).every((v) => typeof v === "string");
  }

  defaultMessage(args: ValidationArguments): string {
    return "payload must be an object with string values only";
  }
}


export class CreateSignatureRequestDto {

  @IsEnum(SignatureTemplateId)
  @ApiProperty({ enum: SignatureTemplateId })
  templateId: SignatureTemplateId;

  @ApiProperty()
  @ApiProperty({
    type: "object",
    additionalProperties: { type: "string" },
    example: {
      fullName: "John Doe",
      email: "john@example.com",
      phone: "+1 234 5678",
    }
  })
  @Validate(StringRecordValidator)
  payload: Record<string, string>;
}



