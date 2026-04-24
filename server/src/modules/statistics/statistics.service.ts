import { Injectable } from '@nestjs/common';
import { getSupabaseClient } from '../../storage/database/supabase-client';

@Injectable()
export class StatisticsService {
  /**
   * 获取统计数据
   */
  async getStatistics(company?: string) {
    const client = getSupabaseClient();

    // 获取订单统计
    const { data: orders, error: ordersError } = await client
      .from('business_orders')
      .select('id, status, contract_amount, created_at, company');

    if (ordersError) {
      throw new Error(`获取订单数据失败: ${ordersError.message}`);
    }

    const filteredOrders = company
      ? orders.filter(o => o.company === company)
      : orders;

    // 订单统计
    const totalOrders = filteredOrders.length;
    const pendingOrders = filteredOrders.filter(o => o.status === 'pending').length;
    const lockedOrders = filteredOrders.filter(o => o.status === 'locked').length;
    const inProgressOrders = filteredOrders.filter(o => o.status === 'in_progress').length;
    const completedOrders = filteredOrders.filter(o => o.status === 'completed').length;

    // 金额统计
    const totalAmount = filteredOrders.reduce((sum, o) => sum + parseFloat(o.contract_amount || '0'), 0);
    const currentMonth = new Date().toISOString().slice(0, 7);
    const thisMonthOrders = filteredOrders.filter(o => o.created_at.startsWith(currentMonth));
    const thisMonthAmount = thisMonthOrders.reduce((sum, o) => sum + parseFloat(o.contract_amount || '0'), 0);

    // 用户统计
    const { data: users, error: usersError } = await client
      .from('users')
      .select('id, is_active, company');

    if (usersError) {
      throw new Error(`获取用户数据失败: ${usersError.message}`);
    }

    const filteredUsers = company
      ? users.filter(u => u.company === company)
      : users;

    const totalUsers = filteredUsers.length;
    const activeUsers = filteredUsers.filter(u => u.is_active).length;

    return {
      orders: {
        total: totalOrders,
        pending: pendingOrders,
        locked: lockedOrders,
        inProgress: inProgressOrders,
        completed: completedOrders,
      },
      amount: {
        total: totalAmount,
        thisMonth: thisMonthAmount,
      },
      users: {
        total: totalUsers,
        active: activeUsers,
      },
    };
  }
}
