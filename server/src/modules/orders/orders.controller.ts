import { Controller, Post, Get, Put, Delete, Body, Param, Query, HttpCode, HttpStatus } from '@nestjs/common';
import { OrdersService } from './orders.service';

@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  /**
   * 创建订单
   */
  @Post()
  @HttpCode(HttpStatus.OK)
  async createOrder(@Body() body: any) {
    try {
      const order = await this.ordersService.createOrder(body);
      return {
        code: 200,
        msg: '创建成功',
        data: order,
      };
    } catch (error) {
      return {
        code: 500,
        msg: error.message || '创建失败',
        data: null,
      };
    }
  }

  /**
   * 获取订单列表
   */
  @Get()
  @HttpCode(HttpStatus.OK)
  async getOrderList(
    @Query('status') status?: string,
    @Query('company') company?: string,
    @Query('managerId') managerId?: string,
    @Query('customerName') customerName?: string,
  ) {
    try {
      const result = await this.ordersService.getOrders({
        status,
        company,
        managerId,
        customerName,
      });

      return {
        code: 200,
        msg: '获取成功',
        data: result,
      };
    } catch (error) {
      return {
        code: 500,
        msg: error.message || '获取失败',
        data: null,
      };
    }
  }

  /**
   * 获取订单详情
   */
  @Get(':id')
  @HttpCode(HttpStatus.OK)
  async getOrderDetail(@Param('id') id: string) {
    try {
      const order = await this.ordersService.getOrderDetail(id);
      if (!order) {
        return {
          code: 404,
          msg: '订单不存在',
          data: null,
        };
      }
      return {
        code: 200,
        msg: '获取成功',
        data: order,
      };
    } catch (error) {
      return {
        code: 500,
        msg: error.message || '获取失败',
        data: null,
      };
    }
  }

  /**
   * 更新订单状态
   */
  @Put(':id/status')
  @HttpCode(HttpStatus.OK)
  async updateOrderStatus(@Param('id') id: string, @Body() body: { status: string }) {
    try {
      const order = await this.ordersService.updateOrderStatus(id, body.status);
      return {
        code: 200,
        msg: '更新成功',
        data: order,
      };
    } catch (error) {
      return {
        code: 500,
        msg: error.message || '更新失败',
        data: null,
      };
    }
  }
}
