import { Module } from '@nestjs/common';
import { SomeService } from './some.service';

@Module({
  providers: [SomeService],
})
export class SomeModule {}
