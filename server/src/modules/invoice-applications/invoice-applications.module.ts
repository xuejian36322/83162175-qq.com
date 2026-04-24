import { Module } from '@nestjs/common';
import { InvoiceApplicationsController } from './invoice-applications.controller';
import { InvoiceApplicationsService } from './invoice-applications.service';

@Module({
  controllers: [InvoiceApplicationsController],
  providers: [InvoiceApplicationsService],
  exports: [InvoiceApplicationsService],
})
export class InvoiceApplicationsModule {}
