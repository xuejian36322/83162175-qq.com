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
    @Query('page') page?: string,
    @Query('pageSize') pageSize?: string,
    @Query('status') status?: string,
    @Query('company') company?: string,
    @Query('keyword') keyword?: string,
  ) {
    try {
      const result = await this.ordersService.getOrderList({
        page: page ? parseInt(page) : 1,
        pageSize: pageSize ? parseInt(pageSize) : 20,
        status,
        company,
        keyword,
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
   * 更新订单
   */
  @Put(':id')
  @HttpCode(HttpStatus.OK)
  async updateOrder(@Param('id') id: string, @Body() body: any) {
    try {
      const order = await this.ordersService.updateOrder(id, body);
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

  /**
   * 删除订单
   */
  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  async deleteOrder(@Param('id') id: string) {
    try {
      await this.ordersService.deleteOrder(id);
      return {
        code: 200,
        msg: '删除成功',
        data: { success: true },
      };
    } catch (error) {
      return {
        code: 500,
        msg: error.message || '删除失败',
        data: null,
      };
    }
  }
}
