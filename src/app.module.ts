import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { SharedModule } from '@src/modules/shared/shared.module';
import { AuthModule } from '@src/modules/auth/auth.module';
import { SignaturesModule } from '@src/modules/signatures/signatures.module';


@Module({
  imports: [
    SharedModule,
    AuthModule,
    SignaturesModule,
  ],
  controllers: [AppController],
  providers: [],
})
export class AppModule {}
