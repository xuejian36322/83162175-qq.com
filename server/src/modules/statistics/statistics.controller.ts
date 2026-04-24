import { Controller, Get, Query, HttpCode, HttpStatus } from '@nestjs/common';
import { StatisticsService } from './statistics.service';

@Controller('statistics')
export class StatisticsController {
  constructor(private readonly statisticsService: StatisticsService) {}

  /**
   * 获取统计数据
   */
  @Get()
  @HttpCode(HttpStatus.OK)
  async getStatistics(@Query('company') company?: string) {
    try {
      const stats = await this.statisticsService.getStatistics(company);
      return {
        code: 200,
        msg: '获取成功',
        data: stats,
      };
    } catch (error) {
      return {
        code: 500,
        msg: error.message || '获取失败',
        data: null,
      };
    }
  }
}
