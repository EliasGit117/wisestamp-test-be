import { ApiProperty } from "@nestjs/swagger";
import { UserRole, UserStatus } from '@src/modules/auth/entities/user.entity';

export class UserDto {

  constructor(properties: UserDto) {
    Object.assign(this, properties);
  }

  @ApiProperty({ example: 1 })
  id: number;

  @ApiProperty({ example: 'alex.mason@outlook.com' })
  email: string;

  @ApiProperty({ example: 'Alex' })
  firstName: string;

  @ApiProperty({ example: 'Mason' })
  lastName: string;

  @ApiProperty({ enum: UserRole, example: UserRole.User })
  role: UserRole;

  @ApiProperty({ enum: UserStatus, example: UserStatus.Active })
  status: UserStatus;

  @ApiProperty({ example: new Date().toISOString() })
  created: string;

  @ApiProperty({ example: new Date().toISOString() })
  updated: string;
}