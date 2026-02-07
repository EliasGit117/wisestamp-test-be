import { ExecutionContext, Injectable } from '@nestjs/common';
import { AuthGuard, IAuthModuleOptions } from "@nestjs/passport";

@Injectable()
export class RefreshTokenGuard extends AuthGuard("refresh-token-strategy") {

  override getAuthenticateOptions(context: ExecutionContext): IAuthModuleOptions | undefined {
    const options = super.getAuthenticateOptions(context) || {};
    options.property = "refreshTokenPayload";
    return options;
  }
}
