import { Module } from '@nestjs/common';
import { MessageModule } from './gateway/message.module';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: [`.env`, `local.env`, `development.env`, `production.env`],
      ignoreEnvFile: false,
    }),
    MessageModule,
  ],
})
export class AppModule {}