import { Module } from '@nestjs/common';
import { DltService } from './dlt.service';
import { DltController } from './dlt.controller';

@Module({
  controllers: [DltController],
  providers: [DltService],
  exports: [DltService],
})
export class DltModule {}
