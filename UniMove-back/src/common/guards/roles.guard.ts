import { CanActivate, ExecutionContext, ForbiddenException, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ROLES_KEY, AuthUser } from '../decorators/auth.decorators';
import { RoleName } from '../../generated/prisma/enums';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}
  canActivate(context: ExecutionContext) {
    const roles = this.reflector.getAllAndOverride<RoleName[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (!roles?.length) return true;
    const user = context.switchToHttp().getRequest<{ user: AuthUser }>().user;
    if (!roles.some((role) => user.roles.includes(role)))
      throw new ForbiddenException('Perfil sem permissão para esta operação.');
    return true;
  }
}
