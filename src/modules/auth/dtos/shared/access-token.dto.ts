import { UserRole, UserStatus } from '@src/modules/auth/entities/user.entity';

export class AccessTokenDto {

  constructor(properties: AccessTokenDto) {
    Object.assign(this, properties);
  }

  ver: number;
  userId: number;
  refreshTokenId: string;
  userStatus: UserStatus;
  role: UserRole;
  email: string;
  firstName: string;
  lastName: string;

  declare iat?: number;
  declare exp?: number;
}
