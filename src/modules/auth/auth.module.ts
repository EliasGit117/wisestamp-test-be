import { Module } from '@nestjs/common';
import { AuthController } from '@src/modules/auth/controllers/auth.controller';
import { authCommandHandlers } from '@src/modules/auth/cqrs/auth.command-handlers';
import { authQueryHandlers } from '@src/modules/auth/cqrs/auth.query-handlers';
import { authServiceProviders } from '@src/modules/auth/services/auth-service.providers';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from '@src/modules/auth/entities/user.entity';
import { RefreshTokenEntity } from '@src/modules/auth/entities/refresh-token.entity';
import { PassportModule } from '@nestjs/passport';
import { ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { AccessTokenStrategy } from '@src/modules/auth/strategies/access-token.strategy';
import { RefreshTokenStrategy } from '@src/modules/auth/strategies/refresh-token.strategy';
import { authRepositoryProviders } from '@src/modules/auth/repositories/auth-repository.providers';


@Module({
  imports: [
    TypeOrmModule.forFeature([
      UserEntity,
      RefreshTokenEntity
    ]),
    PassportModule,
    JwtModule.registerAsync({
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET'),
        signOptions: { expiresIn: '5m' }
      })
    })
  ],
  controllers: [AuthController],
  providers: [
    ...authCommandHandlers,
    ...authQueryHandlers,
    ...authServiceProviders,
    ...authRepositoryProviders,
    AccessTokenStrategy,
    RefreshTokenStrategy
  ],
  exports: [],
})
export class AuthModule {}
