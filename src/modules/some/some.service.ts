import { Injectable } from '@nestjs/common';
import { Logger } from '../logger';

@Injectable()
export class SomeService {
  constructor(private readonly logger: Logger) {
    this.logger
      .setOptions({ timestamp: false })
      .info('Message without timestamp');
  }
}
