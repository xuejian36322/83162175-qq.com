import { Module } from '@nestjs/common';
import { BusinessOrdersController } from './business-orders.controller';
import { BusinessOrdersService } from './business-orders.service';

@Module({
  controllers: [BusinessOrdersController],
  providers: [BusinessOrdersService],
  exports: [BusinessOrdersService],
})
export class BusinessOrdersModule {}
