import { Command, CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { Logger } from '@nestjs/common';
import { SignInResultDto } from '@src/modules/auth/dtos/sign-in/sign-in-result.dto';
import { AuthService } from '@src/modules/auth/services/auth.service';
import { UserDtoFactory } from '@src/modules/auth/services/user.dto-factory';
import { SignUpResultDto } from '@src/modules/auth/dtos/sign-up/sign-up-result';
import { SignUpRequestDto } from '../../dtos/sign-up/sign-up-request.dto';


interface ISignUpCommandProperties extends SignUpRequestDto {}

export class SignUpCommand extends Command<SignUpResultDto> implements ISignUpCommandProperties {
  email: string;
  password: string;
  firstName: string;
  lastName: string;

  constructor(properties: ISignUpCommandProperties) {
    super();
    Object.assign(this, properties);
  }
}

@CommandHandler(SignUpCommand)
export class SignUpCommandHandler implements ICommandHandler<SignUpCommand> {
  private readonly logger = new Logger(SignUpCommandHandler.name);

  constructor(
    private readonly authService: AuthService,
    private readonly userDtoFactory: UserDtoFactory,
  ) {
  }

  async execute(command: SignUpCommand): Promise<SignUpResultDto> {
    this.logger.debug(`SignUp command executed with email: ${command.email}`);
    const user = await this.authService.signUp(command);
    const userDto = this.userDtoFactory.fromEntity(user);

    return new SignUpResultDto({ user: userDto });
  }
}