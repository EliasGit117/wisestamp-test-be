import { SetMetadata } from '@nestjs/common';
import { UserRole } from '@src/modules/auth/entities/user.entity';

export const Roles = (...roles: UserRole[]) => SetMetadata('roles', roles);
