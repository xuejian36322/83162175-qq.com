import { Injectable } from '@nestjs/common';
import { getSupabaseClient } from '../../storage/database/supabase-client';

@Injectable()
export class BusinessOrdersService {
  /**
   * 获取地图订单列表（未施工订单）
   * 状态为 pending 或未施工的订单
   */
  async getMapOrders(company?: string) {
    const client = getSupabaseClient();

    let query = client
      .from('business_orders')
      .select(`
        id,
        customer_name,
        address,
        quantity,
        lock_status,
        locked_by,
        locked_at,
        status,
        created_at,
        users!business_orders_locked_by_fkey (
          id,
          name
        )
      `)
      .or('status.eq.pending,status.eq.unlocked')
      .order('created_at', { ascending: false });

    if (company) {
      query = query.eq('company', company);
    }

    const { data, error } = await query;

    if (error) {
      throw new Error(`获取订单列表失败: ${error.message}`);
    }

    // 格式化数据，添加锁定人名称
    return data.map((order: any) => ({
      id: order.id,
      customer_name: order.customer_name,
      address: order.address,
      quantity: order.quantity || 0,
      lock_status: order.lock_status || 'unlocked',
      locked_by: order.locked_by,
      locked_at: order.locked_at,
      status: order.status,
      executor_name: order.users?.name || null,
      created_at: order.created_at,
    }));
  }

  /**
   * 锁定订单（先到先得）
   */
  async lockOrder(orderId: string, userId: string) {
    const client = getSupabaseClient();

    // 先检查订单状态
    const { data: order, error: queryError } = await client
      .from('business_orders')
      .select('id, lock_status, locked_by, status')
      .eq('id', orderId)
      .maybeSingle();

    if (queryError) {
      throw new Error(`查询订单失败: ${queryError.message}`);
    }

    if (!order) {
      throw new Error('订单不存在');
    }

    // 检查订单是否已被锁定
    if (order.lock_status === 'locked' && order.locked_by !== userId) {
      throw new Error('订单已被他人锁定');
    }

    if (order.lock_status === 'locked' && order.locked_by === userId) {
      // 已经是自己的锁定订单，直接返回
      return { success: true, message: '订单已锁定' };
    }

    // 锁定订单
    const { data: updatedOrder, error: updateError } = await client
      .from('business_orders')
      .update({
        lock_status: 'locked',
        locked_by: userId,
        locked_at: new Date().toISOString(),
        status: 'locked', // 更新订单状态为已锁定
        updated_at: new Date().toISOString(),
      })
      .eq('id', orderId)
      .select()
      .single();

    if (updateError) {
      throw new Error(`锁定订单失败: ${updateError.message}`);
    }

    return {
      success: true,
      message: '锁定成功',
      data: updatedOrder,
    };
  }

  /**
   * 解锁订单
   */
  async unlockOrder(orderId: string, userId: string) {
    const client = getSupabaseClient();

    // 先检查订单状态
    const { data: order, error: queryError } = await client
      .from('business_orders')
      .select('id, lock_status, locked_by')
      .eq('id', orderId)
      .maybeSingle();

    if (queryError) {
      throw new Error(`查询订单失败: ${queryError.message}`);
    }

    if (!order) {
      throw new Error('订单不存在');
    }

    // 检查是否是锁定人
    if (order.locked_by !== userId) {
      throw new Error('只能解锁自己锁定的订单');
    }

    if (order.lock_status === 'unlocked') {
      // 已经是解锁状态，直接返回
      return { success: true, message: '订单已解锁' };
    }

    // 解锁订单
    const { data: updatedOrder, error: updateError } = await client
      .from('business_orders')
      .update({
        lock_status: 'unlocked',
        locked_by: null,
        locked_at: null,
        status: 'pending', // 恢复为待执行状态
        updated_at: new Date().toISOString(),
      })
      .eq('id', orderId)
      .select()
      .single();

    if (updateError) {
      throw new Error(`解锁订单失败: ${updateError.message}`);
    }

    return {
      success: true,
      message: '解锁成功',
      data: updatedOrder,
    };
  }

  /**
   * 保存订单执行结果
   */
  async saveExecution(body: {
    orderId: string;
    executionDate?: string;
    actualQuantity?: number;
    testResult?: string;
    executionPhotos?: string[];
    coWorkers?: string[];
    remarks?: string;
  }) {
    const {
      orderId,
      executionDate,
      actualQuantity,
      testResult,
      executionPhotos,
      coWorkers,
      remarks,
    } = body;

    const client = getSupabaseClient();

    // 检查订单是否存在
    const { data: order, error: queryError } = await client
      .from('business_orders')
      .select('id, status')
      .eq('id', orderId)
      .maybeSingle();

    if (queryError) {
      throw new Error(`查询订单失败: ${queryError.message}`);
    }

    if (!order) {
      throw new Error('订单不存在');
    }

    // 更新订单执行结果
    const updateData: any = {
      execution_date: executionDate || new Date().toISOString(),
      actual_quantity: actualQuantity,
      test_result: testResult,
      execution_photos: executionPhotos || [],
      co_workers: coWorkers || [],
      status: 'completed', // 更新为已完成状态
      updated_at: new Date().toISOString(),
    };

    if (remarks) {
      updateData.remarks = remarks;
    }

    const { data: updatedOrder, error: updateError } = await client
      .from('business_orders')
      .update(updateData)
      .eq('id', orderId)
      .select()
      .single();

    if (updateError) {
      throw new Error(`保存执行结果失败: ${updateError.message}`);
    }

    return {
      success: true,
      message: '保存成功',
      data: updatedOrder,
    };
  }
}
