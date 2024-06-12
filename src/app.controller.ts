import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { Logger } from './modules/logger';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private readonly logger: Logger,
  ) {
    this.logger
      .setCtxParams(['Constructor'])
      .resetTimestamp()
      .info('Message with additional context');

    setTimeout(() => this.logger.info('Message after 1000 ms'), 1000);
  }

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }
}
