import { Command, CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { Logger } from "@nestjs/common";
import { SignInRequestDto } from '@src/modules/auth/dtos/sign-in/sign-in-request.dto';
import { AuthService } from '@src/modules/auth/services/auth.service';
import { UserDtoFactory } from '@src/modules/auth/services/user.dto-factory';
import { UserDto } from '@src/modules/auth/dtos/shared/user.dto';


interface ISignInCommandProperties extends SignInRequestDto {}

interface ISignInCommandResult {
  user: UserDto;
  accessToken: string;
  refreshToken: string;
}

export class SignInCommand extends Command<ISignInCommandResult> implements ISignInCommandProperties {
  email: string;
  password: string;

  constructor(properties: ISignInCommandProperties) {
    super();
    Object.assign(this, properties);
  }
}

@CommandHandler(SignInCommand)
export class SignInCommandHandler implements ICommandHandler<SignInCommand> {
  private readonly logger = new Logger(SignInCommandHandler.name);

  constructor(
    private readonly authService: AuthService,
    private readonly userDtoFactory: UserDtoFactory
  ) {}

  async execute({ email, password }: SignInCommand): Promise<ISignInCommandResult> {
    const { accessToken, refreshToken, user } = await this.authService.signIn(email, password);
    this.logger.log(`SignIn command success email = ${email}`);

    const userDto = this.userDtoFactory.fromEntity(user);

    return {
      user: userDto,
      accessToken: accessToken,
      refreshToken: refreshToken,
    };
  }
}