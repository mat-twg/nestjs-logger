import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger } from './modules/logger';

async function bootstrap() {
  const logger = new Logger(undefined, { timestamp: true });
  const app = await NestFactory.create(AppModule, { bufferLogs: true });
  app.useLogger(logger);

  await app.listen(3000);
}
(async () => await bootstrap())();
