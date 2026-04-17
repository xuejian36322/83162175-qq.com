import { Controller, Get, Post, Body, Query, HttpCode, HttpStatus } from '@nestjs/common';
import { BusinessOrdersService } from './business-orders.service';

@Controller('business-orders')
export class BusinessOrdersController {
  constructor(private readonly businessOrdersService: BusinessOrdersService) {}

  /**
   * 获取地图订单列表（未施工订单）
   */
  @Get('map-orders')
  @HttpCode(HttpStatus.OK)
  async getMapOrders(
    @Query('company') company?: string,
  ) {
    try {
      const orders = await this.businessOrdersService.getMapOrders(company);
      return {
        code: 200,
        msg: '获取成功',
        data: orders,
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
   * 锁定订单
   */
  @Post('lock')
  @HttpCode(HttpStatus.OK)
  async lockOrder(@Body() body: { orderId: string; userId: string }) {
    try {
      const { orderId, userId } = body;

      if (!orderId || !userId) {
        return {
          code: 400,
          msg: '缺少必要参数',
          data: null,
        };
      }

      const result = await this.businessOrdersService.lockOrder(orderId, userId);
      return {
        code: 200,
        msg: '锁定成功',
        data: result,
      };
    } catch (error) {
      return {
        code: 500,
        msg: error.message || '锁定失败',
        data: null,
      };
    }
  }

  /**
   * 解锁订单
   */
  @Post('unlock')
  @HttpCode(HttpStatus.OK)
  async unlockOrder(@Body() body: { orderId: string; userId: string }) {
    try {
      const { orderId, userId } = body;

      if (!orderId || !userId) {
        return {
          code: 400,
          msg: '缺少必要参数',
          data: null,
        };
      }

      const result = await this.businessOrdersService.unlockOrder(orderId, userId);
      return {
        code: 200,
        msg: '解锁成功',
        data: result,
      };
    } catch (error) {
      return {
        code: 500,
        msg: error.message || '解锁失败',
        data: null,
      };
    }
  }

  /**
   * 保存订单执行结果
   */
  @Post('execution')
  @HttpCode(HttpStatus.OK)
  async saveExecution(@Body() body: {
    orderId: string;
    executionDate?: string;
    actualQuantity?: number;
    testResult?: string;
    executionPhotos?: string[];
    coWorkers?: string[];
    remarks?: string;
  }) {
    try {
      const result = await this.businessOrdersService.saveExecution(body);
      return {
        code: 200,
        msg: '保存成功',
        data: result,
      };
    } catch (error) {
      return {
        code: 500,
        msg: error.message || '保存失败',
        data: null,
      };
    }
  }
}
