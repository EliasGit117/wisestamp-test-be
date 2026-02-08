import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsString, MaxLength, MinLength } from 'class-validator';


export class SignInRequestDto {

  constructor(properties: SignInRequestDto) {
    Object.assign(this, properties);
  }

  @IsEmail()
  @IsString()
  @ApiProperty({ example: 'vash.stampede@icloud.com' })
  email: string;

  @IsString()
  @MinLength(5)
  @MaxLength(255)
  @ApiProperty({ example: 'Vash.Stampede_671' })
  password: string;
}