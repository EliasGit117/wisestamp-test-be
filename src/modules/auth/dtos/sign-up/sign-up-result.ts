import { ApiProperty } from '@nestjs/swagger';
import { UserDto } from '@src/modules/auth/dtos/shared/user.dto';


export class SignUpResultDto {

  constructor(properties: SignUpResultDto) {
    Object.assign(this, properties);
  }

  @ApiProperty({ type: UserDto })
  user: UserDto;
}