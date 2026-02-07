import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsOptional, IsString, MaxLength, MinLength } from "class-validator";

export class SignUpRequestDto {

  constructor(properties: SignUpRequestDto) {
    Object.assign(this, properties);
  }

  @IsString()
  @MinLength(3)
  @MaxLength(20)
  @ApiProperty({ example: 'Vash' })
  firstName: string;

  @IsString()
  @MinLength(3)
  @MaxLength(20)
  @ApiProperty({ example: 'Stampede' })
  lastName: string;

  @IsEmail()
  @ApiProperty({ example: 'vash.stampede@icloud.com' })
  email: string;

  @MinLength(5)
  @MaxLength(255)
  @ApiProperty({ example: 'Vash.Stampede_671' })
  password: string;
}