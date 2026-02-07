import { CanActivate, ExecutionContext, ForbiddenException, Injectable } from "@nestjs/common";
import { Reflector } from "@nestjs/core";

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const allowAnonymous = this.reflector.get<boolean>('allow-anonymous', context.getHandler());
    if (allowAnonymous)
      return true;

    const requiredRoles = this.reflector.get<string[]>('roles', context.getHandler());
    if (!requiredRoles)
      return true;

    const request = context.switchToHttp().getRequest();
    const accessTokenPayload = request.accessTokenPayload;

    if (!requiredRoles.includes(accessTokenPayload.role))
      throw new ForbiddenException('You do not have permission to access this resource');

    return true;
  }
}
