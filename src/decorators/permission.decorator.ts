import { SetMetadata } from '@nestjs/common';
import { PERMISSIONS } from 'src/utils/permissions.enum';

export const PERMISSION_KEY = 'permissions';
export const RequirePermissions = (...args: PERMISSIONS[]) => SetMetadata(PERMISSION_KEY, args);
