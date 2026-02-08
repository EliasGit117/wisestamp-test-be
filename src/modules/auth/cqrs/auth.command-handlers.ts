import { SignInCommandHandler } from '@src/modules/auth/cqrs/commands/sign-in.command';
import { SignUpCommandHandler } from '@src/modules/auth/cqrs/commands/sign-up.command';
import { RefreshTokenCommandHandler } from '@src/modules/auth/cqrs/commands/refresh-token.command';
import { SignOutCommandHandler } from '@src/modules/auth/cqrs/commands/sign-out.command';

export const authCommandHandlers = [
  SignInCommandHandler,
  SignUpCommandHandler,
  SignOutCommandHandler,
  RefreshTokenCommandHandler,
];
