import { Injectable } from '@nestjs/common';
import { getSupabaseClient } from '../../storage/database/supabase-client';

@Injectable()
export class ExpenseApplicationsService {
  /**
   * 创建费用申请
   */
  async createExpenseApplication(applicationData: {
    expenseType: string;
    orderIds: string[];
    totalAmount: string;
    expenseDetails: string;
    payee: string;
    applicantId: string;
  }) {
    const client = getSupabaseClient();

    const { data, error } = await client
      .from('expense_applications')
      .insert({
        expense_type: applicationData.expenseType,
        order_ids: applicationData.orderIds,
        total_amount: applicationData.totalAmount,
        expense_details: applicationData.expenseDetails,
        payee: applicationData.payee,
        applicant_id: applicationData.applicantId,
        approval_status: 'pending',
      })
      .select()
      .single();

    if (error) {
      throw new Error(`创建费用申请失败: ${error.message}`);
    }

    return data;
  }

  /**
   * 获取费用申请列表
   */
  async getExpenseApplications(filters?: {
    applicantId?: string;
    approvalStatus?: string;
    expenseType?: string;
  }) {
    const client = getSupabaseClient();

    let query = client
      .from('expense_applications')
      .select(`
        *,
        users!expense_applications_applicant_id_users_id_fk (
          id,
          name
        )
      `)
      .order('created_at', { ascending: false });

    if (filters?.applicantId) {
      query = query.eq('applicant_id', filters.applicantId);
    }

    if (filters?.approvalStatus) {
      query = query.eq('approval_status', filters.approvalStatus);
    }

    if (filters?.expenseType) {
      query = query.eq('expense_type', filters.expenseType);
    }

    const { data, error } = await query;

    if (error) {
      throw new Error(`获取费用申请列表失败: ${error.message}`);
    }

    return data || [];
  }

  /**
   * 审批费用申请
   */
  async approveExpenseApplication(id: string, approverId: string, approved: boolean, remarks?: string) {
    const client = getSupabaseClient();

    const { data, error } = await client
      .from('expense_applications')
      .update({
        approval_status: approved ? 'approved' : 'rejected',
        approver_id: approverId,
        payment_date: approved ? new Date().toISOString() : null,
        updated_at: new Date().toISOString(),
      })
      .eq('id', id)
      .select()
      .single();

    if (error) {
      throw new Error(`审批费用申请失败: ${error.message}`);
    }

    return data;
  }
}
