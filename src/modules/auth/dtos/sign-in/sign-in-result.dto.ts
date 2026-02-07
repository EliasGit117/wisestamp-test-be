import { ApiProperty } from '@nestjs/swagger';
import { UserDto } from '@src/modules/auth/dtos/shared/user.dto';

export class SignInResultDto {

  constructor(properties: SignInResultDto) {
    Object.assign(this, properties);
  }

  @ApiProperty({ type: UserDto })
  user: UserDto;
}