import { Injectable } from '@nestjs/common';
import { getSupabaseClient } from '../../storage/database/supabase-client';

@Injectable()
export class OrdersService {
  /**
   * 创建订单（支持多业务类型）
   */
  async createOrder(orderData: {
    orderNo: string;
    orderDate: string;
    customerName: string;
    invoiceCompanyName?: string;
    reportName?: string;
    company: string;
    contractAmount: number;
    actualAmount?: string;
    commissionStandard?: string;
    commissionFee?: string;
    thirdPartyCollection?: string;
    transportFee?: string;
    taxFee?: string;
    deposit?: string;
    laborFee?: string;
    laborFeeRemaining?: string;
    sourceUserId?: string;
    executor1Id?: string;
    executor2Id?: string;
    executionDate?: string;
    commissionDate?: string;
    paymentDate?: string;
    paymentMethod: string;
    reportType?: string;
    testResult?: string;
    contactPerson?: string;
    contactPhone?: string;
    address?: string;
    locationLatitude?: string;
    locationLongitude?: string;
    trackingNumber?: string;
    remarks?: string;
    managerId: string;
    businessTypes: Array<{
      businessTypeId: string;
      businessTypeName: string;
      quantity: number;
      unitPrice: number;
      contractAmount: number;
    }>;
  }) {
    const client = getSupabaseClient();

    const {
      orderNo,
      orderDate,
      customerName,
      invoiceCompanyName,
      reportName,
      company,
      contractAmount,
      actualAmount,
      commissionStandard,
      commissionFee,
      thirdPartyCollection,
      transportFee,
      taxFee,
      deposit,
      laborFee,
      laborFeeRemaining,
      sourceUserId,
      executor1Id,
      executor2Id,
      executionDate,
      commissionDate,
      paymentDate,
      paymentMethod,
      reportType,
      testResult,
      contactPerson,
      contactPhone,
      address,
      locationLatitude,
      locationLongitude,
      trackingNumber,
      remarks,
      managerId,
      businessTypes,
    } = orderData;

    // 验证业务类型
    if (!businessTypes || businessTypes.length === 0) {
      throw new Error('请至少选择一种业务类型');
    }

    // 创建订单主记录
    const { data: order, error: orderError } = await client
      .from('business_orders')
      .insert({
        order_no: orderNo,
        order_date: orderDate,
        customer_name: customerName,
        invoice_company_name: invoiceCompanyName,
        report_name: reportName,
        business_type: businessTypes[0].businessTypeName, // 主业务类型
        quantity: businessTypes.reduce((sum, item) => sum + item.quantity, 0),
        contract_amount: contractAmount,
        actual_amount: actualAmount,
        commission_standard: commissionStandard,
        commission_fee: commissionFee,
        third_party_collection: thirdPartyCollection,
        transport_fee: transportFee,
        tax_fee: taxFee,
        deposit: deposit,
        labor_fee: laborFee,
        labor_fee_remaining: laborFeeRemaining,
        manager_id: managerId,
        source_user_id: sourceUserId,
        executor1_id: executor1Id,
        executor2_id: executor2Id,
        execution_date: executionDate,
        commission_date: commissionDate,
        payment_date: paymentDate,
        payment_method: paymentMethod,
        report_type: reportType,
        test_result: testResult,
        contact_person: contactPerson,
        contact_phone: contactPhone,
        address: address,
        location_latitude: locationLatitude,
        location_longitude: locationLongitude,
        tracking_number: trackingNumber,
        remarks: remarks,
        company: company,
        status: 'pending',
      })
      .select()
      .single();

    if (orderError) {
      throw new Error(`创建订单失败: ${orderError.message}`);
    }

    // 创建订单业务类型关联记录
    const orderBusinessTypes = businessTypes.map(item => ({
      order_id: order.id,
      business_type_id: item.businessTypeId,
      business_type_name: item.businessTypeName,
      quantity: item.quantity,
      unit_price: item.unitPrice,
      contract_amount: item.contractAmount,
    }));

    const { error: businessTypesError } = await client
      .from('order_business_types')
      .insert(orderBusinessTypes);

    if (businessTypesError) {
      // 如果业务类型插入失败，删除已创建的订单
      await client
        .from('business_orders')
        .delete()
        .eq('id', order.id);
      throw new Error(`创建订单业务类型失败: ${businessTypesError.message}`);
    }

    return order;
  }

  /**
   * 获取订单列表
   */
  async getOrders(filters?: {
    company?: string;
    status?: string;
    managerId?: string;
    customerName?: string;
  }) {
    const client = getSupabaseClient();

    let query = client
      .from('business_orders')
      .select(`
        id,
        order_no,
        order_date,
        customer_name,
        business_type,
        quantity,
        contract_amount,
        commission_fee,
        status,
        company,
        created_at,
        users!business_orders_manager_id_fkey (
          id,
          name
        )
      `)
      .order('created_at', { ascending: false });

    if (filters?.company) {
      query = query.eq('company', filters.company);
    }

    if (filters?.status) {
      query = query.eq('status', filters.status);
    }

    if (filters?.managerId) {
      query = query.eq('manager_id', filters.managerId);
    }

    if (filters?.customerName) {
      query = query.ilike('customer_name', `%${filters.customerName}%`);
    }

    const { data, error } = await query;

    if (error) {
      throw new Error(`获取订单列表失败: ${error.message}`);
    }

    return data || [];
  }

  /**
   * 获取订单详情（包含业务类型列表）
   */
  async getOrderDetail(id: string) {
    const client = getSupabaseClient();

    // 获取订单主信息
    const { data: order, error: orderError } = await client
      .from('business_orders')
      .select(`
        *,
        users!business_orders_manager_id_fkey (
          id,
          name
        ),
        users!business_orders_source_user_id_fkey (
          id,
          name
        ),
        users!business_orders_executor1_id_fkey (
          id,
          name
        ),
        users!business_orders_executor2_id_fkey (
          id,
          name
        )
      `)
      .eq('id', id)
      .maybeSingle();

    if (orderError) {
      throw new Error(`获取订单详情失败: ${orderError.message}`);
    }

    if (!order) {
      return null;
    }

    // 获取订单业务类型列表
    const { data: businessTypes, error: businessTypesError } = await client
      .from('order_business_types')
      .select('*')
      .eq('order_id', id);

    if (businessTypesError) {
      throw new Error(`获取业务类型列表失败: ${businessTypesError.message}`);
    }

    return {
      ...order,
      businessTypes: businessTypes || [],
    };
  }

  /**
   * 更新订单状态
   */
  async updateOrderStatus(id: string, status: string) {
    const client = getSupabaseClient();

    const { data, error } = await client
      .from('business_orders')
      .update({
        status,
        updated_at: new Date().toISOString(),
      })
      .eq('id', id)
      .select()
      .single();

    if (error) {
      throw new Error(`更新订单状态失败: ${error.message}`);
    }

    return data;
  }
}
