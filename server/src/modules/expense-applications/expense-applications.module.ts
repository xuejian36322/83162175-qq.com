import { Module } from '@nestjs/common';
import { ExpenseApplicationsController } from './expense-applications.controller';
import { ExpenseApplicationsService } from './expense-applications.service';

@Module({
  controllers: [ExpenseApplicationsController],
  providers: [ExpenseApplicationsService],
  exports: [ExpenseApplicationsService],
})
export class ExpenseApplicationsModule {}
