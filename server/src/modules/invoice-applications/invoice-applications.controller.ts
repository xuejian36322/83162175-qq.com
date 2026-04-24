import { Controller, Get, Post, Put, Body, Query, Param, HttpCode, HttpStatus } from '@nestjs/common';
import { InvoiceApplicationsService } from './invoice-applications.service';

@Controller('invoice-applications')
export class InvoiceApplicationsController {
  constructor(private readonly invoiceApplicationsService: InvoiceApplicationsService) {}

  /**
   * 创建开票申请
   */
  @Post()
  @HttpCode(HttpStatus.OK)
  async createInvoiceApplication(@Body() body: {
    orderId?: string;
    customerName: string;
    invoiceCompanyName: string;
    taxId: string;
    invoiceItems: string;
    invoiceDetails: string;
    invoiceAmount: string;
    invoiceType: string;
    invoiceBelonging?: string;
    remarks?: string;
    applicantId: string;
  }) {
    try {
      const application = await this.invoiceApplicationsService.createInvoiceApplication(body);
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
   * 获取开票申请列表
   */
  @Get()
  @HttpCode(HttpStatus.OK)
  async getInvoiceApplications(
    @Query('applicantId') applicantId?: string,
    @Query('status') status?: string,
    @Query('invoiceBelonging') invoiceBelonging?: string,
  ) {
    try {
      const filters: any = {};
      if (applicantId) filters.applicantId = applicantId;
      if (status) filters.status = status;
      if (invoiceBelonging) filters.invoiceBelonging = invoiceBelonging;

      const applications = await this.invoiceApplicationsService.getInvoiceApplications(filters);
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
   * 更新开票申请状态
   */
  @Put(':id/status')
  @HttpCode(HttpStatus.OK)
  async updateInvoiceApplicationStatus(
    @Param('id') id: string,
    @Body() body: { status: string }
  ) {
    try {
      const application = await this.invoiceApplicationsService.updateInvoiceApplicationStatus(
        id,
        body.status
      );
      return {
        code: 200,
        msg: '更新成功',
        data: application,
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
