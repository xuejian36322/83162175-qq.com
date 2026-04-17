import { Module } from '@nestjs/common';
import { AppController } from '@/app.controller';
import { AppService } from '@/app.service';
import { AuthModule } from './modules/auth/auth.module';
import { OrdersModule } from './modules/orders/orders.module';
import { BusinessOrdersModule } from './modules/business-orders/business-orders.module';

@Module({
  imports: [AuthModule, OrdersModule, BusinessOrdersModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
