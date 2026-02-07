import { ExecutionContext, Injectable } from "@nestjs/common";
import { AuthGuard, IAuthModuleOptions } from "@nestjs/passport";

@Injectable()
export class AccessTokenGuard extends AuthGuard("access-token-strategy") {

  override getAuthenticateOptions(context: ExecutionContext): IAuthModuleOptions | undefined {
    const options = super.getAuthenticateOptions(context) || {};
    options.property = "accessTokenPayload";
    return options;
  }
}
