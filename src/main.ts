import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { FastifyAdapter, NestFastifyApplication } from '@nestjs/platform-fastify';
import { Logger } from 'nestjs-pino';
import { ValidationPipe } from '@nestjs/common';
import fastifyCookie from '@fastify/cookie';
import multipart from '@fastify/multipart';
import { ConfigService } from '@nestjs/config';
import { configureOpenapi } from '@src/openapi';
import { AccessTokenDto } from '@src/modules/auth/dtos/shared/access-token.dto';
import { RefreshTokenDto } from '@src/modules/auth/dtos/shared/refresh-token.dto';



declare module 'fastify' {
  interface FastifyRequest {
    accessTokenPayload?: AccessTokenDto;
    refreshTokenPayload?: RefreshTokenDto;
  }
}


const port = process.env.PORT ?? 3000;

async function bootstrap() {
  const app = await NestFactory.create<NestFastifyApplication>(AppModule, new FastifyAdapter(), { bufferLogs: true });
  const configService = app.get(ConfigService);

  app.useLogger(app.get(Logger));
  app.useGlobalPipes(new ValidationPipe({ transform: true, whitelist: true }));
  await app.register(fastifyCookie, { secret: configService.getOrThrow<string>('COOKIES_SECRET') });
  await app.register(multipart);
  app.enableCors({ origin: 'http://localhost:4000', credentials: true });


  await configureOpenapi(app);
  await app.listen(port, '0.0.0.0');
}

void bootstrap();


