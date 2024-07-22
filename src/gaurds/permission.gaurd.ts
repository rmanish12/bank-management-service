import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { isEmpty } from 'lodash';
import { PERMISSION_KEY } from 'src/decorators/permission.decorator';
import { UserService } from 'src/services/user.service';
import { PERMISSIONS } from 'src/utils/permissions.enum';

@Injectable()
export class PermissionGaurd implements CanActivate {
  constructor(
    private reflector: Reflector,
    private userService: UserService,
  ) {}

  matchPermissions(requiredPermissions: string[], userPermissions: string[]) {
    return requiredPermissions.every((permission) => userPermissions.includes(permission));
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const requiredPermissions = this.reflector.getAllAndOverride<PERMISSIONS[]>(PERMISSION_KEY, [context.getHandler(), context.getClass()]);

    if (isEmpty(requiredPermissions)) {
      return true;
    }

    const req = context.switchToHttp().getRequest();
    const userPermissions = await this.userService.getUserPermissions(req.user);

    return this.matchPermissions(requiredPermissions, userPermissions);
  }
}
