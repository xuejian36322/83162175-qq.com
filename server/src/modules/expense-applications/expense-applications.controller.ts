import { Controller, Get, Post, Put, Body, Query, Param, HttpCode, HttpStatus } from '@nestjs/common';
import { ExpenseApplicationsService } from './expense-applications.service';

@Controller('expense-applications')
export class ExpenseApplicationsController {
  constructor(private readonly expenseApplicationsService: ExpenseApplicationsService) {}

  /**
   * 创建费用申请
   */
  @Post()
  @HttpCode(HttpStatus.OK)
  async createExpenseApplication(@Body() body: {
    expenseType: string;
    orderIds: string[];
    totalAmount: string;
    expenseDetails: string;
    payee: string;
    applicantId: string;
  }) {
    try {
      const application = await this.expenseApplicationsService.createExpenseApplication(body);
      return {
        code: 200,
        msg: '创建成功',
        data: application,
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
   * 获取费用申请列表
   */
  @Get()
  @HttpCode(HttpStatus.OK)
  async getExpenseApplications(
    @Query('applicantId') applicantId?: string,
    @Query('approvalStatus') approvalStatus?: string,
    @Query('expenseType') expenseType?: string,
  ) {
    try {
      const filters: any = {};
      if (applicantId) filters.applicantId = applicantId;
      if (approvalStatus) filters.approvalStatus = approvalStatus;
      if (expenseType) filters.expenseType = expenseType;

      const applications = await this.expenseApplicationsService.getExpenseApplications(filters);
      return {
        code: 200,
        msg: '获取成功',
        data: applications,
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
   * 审批费用申请
   */
  @Put(':id/approve')
  @HttpCode(HttpStatus.OK)
  async approveExpenseApplication(
    @Param('id') id: string,
    @Body() body: { approverId: string; approved: boolean; remarks?: string }
  ) {
    try {
      const { approverId, approved, remarks } = body;
      if (!approverId) {
        return {
          code: 400,
          msg: '缺少 approverId 参数',
          data: null,
        };
      }

      const application = await this.expenseApplicationsService.approveExpenseApplication(
        id,
        approverId,
        approved,
        remarks
      );
      return {
        code: 200,
        msg: '审批成功',
        data: application,
      };
    } catch (error) {
      return {
        code: 500,
        msg: error.message || '审批失败',
        data: null,
      };
    }
  }
}
