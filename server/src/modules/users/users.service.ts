import { Injectable } from '@nestjs/common';
import { getSupabaseClient } from '../../storage/database/supabase-client';

@Injectable()
export class UsersService {
  /**
   * 获取用户列表
   */
  async getUsers(filters?: {
    company?: string;
    role?: string;
    isActive?: boolean;
  }) {
    const client = getSupabaseClient();

    let query = client
      .from('users')
      .select(`
        id,
        open_id,
        name,
        phone,
        avatar_url,
        role,
        company,
        roles,
        is_active,
        created_at,
        updated_at
      `)
      .order('created_at', { ascending: false });

    if (filters?.company) {
      query = query.eq('company', filters.company);
    }

    if (filters?.role) {
      query = query.eq('role', filters.role);
    }

    if (filters?.isActive !== undefined) {
      query = query.eq('is_active', filters.isActive);
    }

    const { data, error } = await query;

    if (error) {
      throw new Error(`获取用户列表失败: ${error.message}`);
    }

    return data || [];
  }

  /**
   * 根据 openId 获取用户
   */
  async getUserByOpenId(openId: string) {
    const client = getSupabaseClient();

    const { data, error } = await client
      .from('users')
      .select(`
        id,
        open_id,
        name,
        phone,
        avatar_url,
        role,
        company,
        roles,
        is_active,
        created_at,
        updated_at
      `)
      .eq('open_id', openId)
      .maybeSingle();

    if (error) {
      throw new Error(`获取用户信息失败: ${error.message}`);
    }

    return data;
  }

  /**
   * 根据 ID 获取用户
   */
  async getUserById(id: string) {
    const client = getSupabaseClient();

    const { data, error } = await client
      .from('users')
      .select(`
        id,
        open_id,
        name,
        phone,
        avatar_url,
        role,
        company,
        roles,
        is_active,
        created_at,
        updated_at
      `)
      .eq('id', id)
      .maybeSingle();

    if (error) {
      throw new Error(`获取用户信息失败: ${error.message}`);
    }

    return data;
  }

  /**
   * 创建用户
   */
  async createUser(userData: {
    openId: string;
    name: string;
    phone?: string;
    avatarUrl?: string;
    role?: string;
    roles?: string[];
    company?: string;
    isActive?: boolean;
  }) {
    const client = getSupabaseClient();

    const { data, error } = await client
      .from('users')
      .insert({
        open_id: userData.openId,
        name: userData.name,
        phone: userData.phone,
        avatar_url: userData.avatarUrl,
        role: userData.role || 'business_manager',
        roles: userData.roles || [],
        company: userData.company || 'sanheng_jiliang',
        is_active: userData.isActive !== undefined ? userData.isActive : true,
      })
      .select()
      .single();

    if (error) {
      throw new Error(`创建用户失败: ${error.message}`);
    }

    return data;
  }

  /**
   * 更新用户
   */
  async updateUser(id: string, userData: {
    name?: string;
    phone?: string;
    avatarUrl?: string;
    role?: string;
    roles?: string[];
    company?: string;
    isActive?: boolean;
  }) {
    const client = getSupabaseClient();

    const updateData: any = {
      updated_at: new Date().toISOString(),
    };

    if (userData.name !== undefined) {
      updateData.name = userData.name;
    }
    if (userData.phone !== undefined) {
      updateData.phone = userData.phone;
    }
    if (userData.avatarUrl !== undefined) {
      updateData.avatar_url = userData.avatarUrl;
    }
    if (userData.role !== undefined) {
      updateData.role = userData.role;
    }
    if (userData.roles !== undefined) {
      updateData.roles = userData.roles;
    }
    if (userData.company !== undefined) {
      updateData.company = userData.company;
    }
    if (userData.isActive !== undefined) {
      updateData.is_active = userData.isActive;
    }

    const { data, error } = await client
      .from('users')
      .update(updateData)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      throw new Error(`更新用户失败: ${error.message}`);
    }

    return data;
  }

  /**
   * 删除用户
   */
  async deleteUser(id: string) {
    const client = getSupabaseClient();

    const { data, error } = await client
      .from('users')
      .delete()
      .eq('id', id)
      .select()
      .single();

    if (error) {
      throw new Error(`删除用户失败: ${error.message}`);
    }

    return data;
  }
}
