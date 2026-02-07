
export class RefreshTokenDto {

  constructor(properties: RefreshTokenDto) {
    Object.assign(this, properties);
  }

  id: string;
  ver: number;
  userId: number;

  declare iat?: number;
  declare exp?: number;
}