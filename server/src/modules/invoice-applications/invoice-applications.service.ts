import { Injectable } from '@nestjs/common';
import { getSupabaseClient } from '../../storage/database/supabase-client';

@Injectable()
export class InvoiceApplicationsService {
  /**
   * 创建开票申请
   */
  async createInvoiceApplication(applicationData: {
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
    const client = getSupabaseClient();

    const { data, error } = await client
      .from('invoice_applications')
      .insert({
        order_id: applicationData.orderId || null,
        customer_name: applicationData.customerName,
        invoice_company_name: applicationData.invoiceCompanyName,
        tax_id: applicationData.taxId,
        invoice_items: applicationData.invoiceItems,
        invoice_details: applicationData.invoiceDetails,
        invoice_amount: applicationData.invoiceAmount,
        invoice_type: applicationData.invoiceType,
        invoice_belonging: applicationData.invoiceBelonging || 'sanheng_jiliang',
        remarks: applicationData.remarks,
        applicant_id: applicationData.applicantId,
        status: 'pending',
      })
      .select()
      .single();

    if (error) {
      throw new Error(`创建开票申请失败: ${error.message}`);
    }

    return data;
  }

  /**
   * 获取开票申请列表
   */
  async getInvoiceApplications(filters?: {
    applicantId?: string;
    status?: string;
    invoiceBelonging?: string;
  }) {
    const client = getSupabaseClient();

    let query = client
      .from('invoice_applications')
      .select(`
        *,
        users!invoice_applications_applicant_id_users_id_fk (
          id,
          name
        )
      `)
      .order('created_at', { ascending: false });

    if (filters?.applicantId) {
      query = query.eq('applicant_id', filters.applicantId);
    }

    if (filters?.status) {
      query = query.eq('status', filters.status);
    }

    if (filters?.invoiceBelonging) {
      query = query.eq('invoice_belonging', filters.invoiceBelonging);
    }

    const { data, error } = await query;

    if (error) {
      throw new Error(`获取开票申请列表失败: ${error.message}`);
    }

    return data || [];
  }

  /**
   * 更新开票申请状态
   */
  async updateInvoiceApplicationStatus(id: string, status: string) {
    const client = getSupabaseClient();

    const { data, error } = await client
      .from('invoice_applications')
      .update({
        status,
        updated_at: new Date().toISOString(),
      })
      .eq('id', id)
      .select()
      .single();

    if (error) {
      throw new Error(`更新开票申请状态失败: ${error.message}`);
    }

    return data;
  }
}
