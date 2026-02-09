import { Global, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { dataSourceOptions } from '@root/db/datasource';
import { LoggerModule } from 'nestjs-pino';
import { ConfigModule } from '@nestjs/config';
import { CqrsModule } from "@nestjs/cqrs";
import { ClsModule, ClsService } from "nestjs-cls";
import { FastifyRequest } from 'fastify';
import { AccessTokenDto } from '@src/modules/auth/dtos/shared/access-token.dto';
import { RefreshTokenDto } from '@src/modules/auth/dtos/shared/refresh-token.dto';
import { InMemoryCacheService } from '@src/modules/shared/services/in-memory-cache.service';
import { ScheduleModule } from "@nestjs/schedule";


declare module 'nestjs-cls' {
  interface ClsStore {
    ip?: string;
    requestId?: string;
    userAgent?: string;
    accessTokenPayload?: AccessTokenDto;
    refreshTokenPayload?: RefreshTokenDto;
  }
}

@Global()
@Module({
  imports: [
    CqrsModule.forRoot(),
    ScheduleModule.forRoot(),
    ConfigModule.forRoot({ isGlobal: true, envFilePath: '.env' }),
    TypeOrmModule.forRoot(dataSourceOptions),
    LoggerModule.forRoot({
      pinoHttp: {
        transport: {
          target: 'pino-pretty',
          options: {
            singleLine: true,
          },
        },
        serializers: {
          req: (req) => ({ id: req.id, method: req.method, url: req.url })
        }
      }
    }),
    ClsModule.forRoot({
      global: true,
      middleware: {
        mount: true,
        setup: (cls: ClsService, req: FastifyRequest) => {
          cls.set('userAgent', Array.isArray(req.headers['user-agent']) ? req.headers['user-agent'][0] : req.headers['user-agent'],);
          cls.set('requestId', req.id);
          cls.set('ip', req.ip);
        },
      },
    }),
  ],
  controllers: [],
  providers: [InMemoryCacheService],
  exports: [InMemoryCacheService],
})
export class SharedModule {}
