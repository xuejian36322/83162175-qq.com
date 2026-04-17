import { Injectable } from '@nestjs/common';
import { getSupabaseClient } from '../../storage/database/supabase-client';

interface CreateOrderDto {
  orderDate: string;
  customerName: string;
  invoiceCompanyName?: string;
  reportName?: string;
  businessType: string;
  quantity: number;
  unitPrice: string;
  contractAmount: string;
  actualAmount?: string;
  commissionStandard?: string;
  commissionFee?: string;
  thirdPartyCollection?: string;
  transportFee?: string;
  taxFee?: string;
  deposit?: string;
  laborFee?: string;
  laborFeeRemaining?: string;
  managerId: string;
  sourceUserId?: string;
  executor1Id?: string;
  executor2Id?: string;
  executionDate?: string;
  commissionDate?: string;
  paymentDate?: string;
  paymentMethod: string;
  status: string;
  reportType?: string;
  testResult?: string;
  contactPerson?: string;
  contactPhone?: string;
  address?: string;
  locationLatitude?: string;
  locationLongitude?: string;
  trackingNumber?: string;
  remarks?: string;
  companyName: string;
}

@Injectable()
export class OrdersService {
  /**
   * 创建订单
   */
  async createOrder(dto: CreateOrderDto) {
    const client = getSupabaseClient();

    // 生成订单号
    const orderNo = 'ORD' + Date.now();

    // 插入订单数据
    const { data, error } = await client
      .from('business_orders')
      .insert({
        order_no: orderNo,
        order_date: dto.orderDate,
        customer_name: dto.customerName,
        invoice_company_name: dto.invoiceCompanyName,
        report_name: dto.reportName,
        business_type: dto.businessType,
        quantity: dto.quantity,
        unit_price: dto.unitPrice,
        contract_amount: dto.contractAmount,
        actual_amount: dto.actualAmount,
        commission_standard: dto.commissionStandard,
        commission_fee: dto.commissionFee,
        third_party_collection: dto.thirdPartyCollection,
        transport_fee: dto.transportFee,
        tax_fee: dto.taxFee,
        deposit: dto.deposit,
        labor_fee: dto.laborFee,
        labor_fee_remaining: dto.laborFeeRemaining,
        manager_id: dto.managerId,
        source_user_id: dto.sourceUserId,
        executor1_id: dto.executor1Id,
        executor2_id: dto.executor2Id,
        execution_date: dto.executionDate,
        commission_date: dto.commissionDate,
        payment_date: dto.paymentDate,
        payment_method: dto.paymentMethod,
        status: dto.status,
        report_type: dto.reportType,
        test_result: dto.testResult,
        contact_person: dto.contactPerson,
        contact_phone: dto.contactPhone,
        address: dto.address,
        location_latitude: dto.locationLatitude,
        location_longitude: dto.locationLongitude,
        tracking_number: dto.trackingNumber,
        remarks: dto.remarks,
        company: dto.companyName,
      })
      .select()
      .single();

    if (error) {
      throw new Error(`创建订单失败: ${error.message}`);
    }

    return data;
  }

  /**
   * 获取订单列表
   */
  async getOrderList(params: {
    page?: number;
    pageSize?: number;
    status?: string;
    company?: string;
    keyword?: string;
  }) {
    const client = getSupabaseClient();

    const { page = 1, pageSize = 20, status, company, keyword } = params;

    let query = client
      .from('business_orders')
      .select('*', { count: 'exact' })
      .order('order_date', { ascending: false });

    if (status) {
      query = query.eq('status', status);
    }

    if (company) {
      query = query.eq('company', company);
    }

    if (keyword) {
      query = query.or(`customer_name.ilike.%${keyword}%,contact_person.ilike.%${keyword}%,contact_phone.ilike.%${keyword}%`);
    }

    // 分页
    const offset = (page - 1) * pageSize;
    query = query.range(offset, offset + pageSize - 1);

    const { data, error, count } = await query;

    if (error) {
      throw new Error(`获取订单列表失败: ${error.message}`);
    }

    return {
      data,
      total: count || 0,
      page,
      pageSize,
      totalPages: Math.ceil((count || 0) / pageSize),
    };
  }

  /**
   * 获取订单详情
   */
  async getOrderDetail(id: string) {
    const client = getSupabaseClient();

    const { data, error } = await client
      .from('business_orders')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      throw new Error(`获取订单详情失败: ${error.message}`);
    }

    return data;
  }

  /**
   * 更新订单
   */
  async updateOrder(id: string, dto: Partial<CreateOrderDto>) {
    const client = getSupabaseClient();

    const updateData: any = {
      updated_at: new Date().toISOString(),
    };

    if (dto.customerName) updateData.customer_name = dto.customerName;
    if (dto.invoiceCompanyName) updateData.invoice_company_name = dto.invoiceCompanyName;
    if (dto.reportName) updateData.report_name = dto.reportName;
    if (dto.businessType) updateData.business_type = dto.businessType;
    if (dto.quantity) updateData.quantity = dto.quantity;
    if (dto.unitPrice) updateData.unit_price = dto.unitPrice;
    if (dto.contractAmount) updateData.contract_amount = dto.contractAmount;
    if (dto.actualAmount) updateData.actual_amount = dto.actualAmount;
    if (dto.commissionStandard) updateData.commission_standard = dto.commissionStandard;
    if (dto.commissionFee) updateData.commission_fee = dto.commissionFee;
    if (dto.thirdPartyCollection) updateData.third_party_collection = dto.thirdPartyCollection;
    if (dto.transportFee) updateData.transport_fee = dto.transportFee;
    if (dto.taxFee) updateData.tax_fee = dto.taxFee;
    if (dto.deposit) updateData.deposit = dto.deposit;
    if (dto.laborFee) updateData.labor_fee = dto.laborFee;
    if (dto.laborFeeRemaining) updateData.labor_fee_remaining = dto.laborFeeRemaining;
    if (dto.executor1Id) updateData.executor1_id = dto.executor1Id;
    if (dto.executor2Id) updateData.executor2_id = dto.executor2Id;
    if (dto.executionDate) updateData.execution_date = dto.executionDate;
    if (dto.commissionDate) updateData.commission_date = dto.commissionDate;
    if (dto.paymentDate) updateData.payment_date = dto.paymentDate;
    if (dto.paymentMethod) updateData.payment_method = dto.paymentMethod;
    if (dto.status) updateData.status = dto.status;
    if (dto.reportType) updateData.report_type = dto.reportType;
    if (dto.testResult) updateData.test_result = dto.testResult;
    if (dto.contactPerson) updateData.contact_person = dto.contactPerson;
    if (dto.contactPhone) updateData.contact_phone = dto.contactPhone;
    if (dto.address) updateData.address = dto.address;
    if (dto.locationLatitude) updateData.location_latitude = dto.locationLatitude;
    if (dto.locationLongitude) updateData.location_longitude = dto.locationLongitude;
    if (dto.trackingNumber) updateData.tracking_number = dto.trackingNumber;
    if (dto.remarks) updateData.remarks = dto.remarks;
    if (dto.companyName) updateData.company = dto.companyName;

    const { data, error } = await client
      .from('business_orders')
      .update(updateData)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      throw new Error(`更新订单失败: ${error.message}`);
    }

    return data;
  }

  /**
   * 删除订单
   */
  async deleteOrder(id: string) {
    const client = getSupabaseClient();

    const { error } = await client
      .from('business_orders')
      .delete()
      .eq('id', id);

    if (error) {
      throw new Error(`删除订单失败: ${error.message}`);
    }

    return { success: true };
  }
}
