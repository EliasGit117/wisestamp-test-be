import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { SharedModule } from '@src/modules/shared/shared.module';
import { AuthModule } from '@src/modules/auth/auth.module';

@Module({
  imports: [
    SharedModule,
    AuthModule
  ],
  controllers: [AppController],
  providers: [],
})
export class AppModule {}
