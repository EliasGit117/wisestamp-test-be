import { AuthService } from '@src/modules/auth/services/auth.service';
import { UserDtoFactory } from '@src/modules/auth/services/user.dto-factory';

export const authServiceProviders = [
  // Services
  AuthService,
  // Factories
  UserDtoFactory
];
