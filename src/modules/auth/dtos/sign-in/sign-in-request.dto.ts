import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, MaxLength, MinLength } from "class-validator";


export class SignInRequestDto {

  constructor(properties: SignInRequestDto) {
    Object.assign(this, properties);
  }

  @IsEmail()
  @ApiProperty({ example: 'vash.stampede@icloud.com' })
  email: string;

  @MinLength(5)
  @MaxLength(255)
  @ApiProperty({ example: 'Vash.Stampede_671' })
  password: string;
}