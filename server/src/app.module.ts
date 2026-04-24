import { Module } from '@nestjs/common';
import { AppController } from '@/app.controller';
import { AppService } from '@/app.service';
import { AuthModule } from './modules/auth/auth.module';
import { OrdersModule } from './modules/orders/orders.module';
import { BusinessOrdersModule } from './modules/business-orders/business-orders.module';
import { UsersModule } from './modules/users/users.module';
import { BusinessTypesModule } from './modules/business-types/business-types.module';
import { ExpenseApplicationsModule } from './modules/expense-applications/expense-applications.module';
import { InvoiceApplicationsModule } from './modules/invoice-applications/invoice-applications.module';
import { StatisticsModule } from './modules/statistics/statistics.module';

@Module({
  imports: [
    AuthModule,
    OrdersModule,
    BusinessOrdersModule,
    UsersModule,
    BusinessTypesModule,
    ExpenseApplicationsModule,
    InvoiceApplicationsModule,
    StatisticsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
