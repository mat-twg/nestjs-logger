import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { LoggerModule } from './modules/logger';
import { SomeModule } from './modules/some/some.module';

@Module({
  imports: [LoggerModule, SomeModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
