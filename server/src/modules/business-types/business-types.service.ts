import { Injectable } from '@nestjs/common';
import { getSupabaseClient } from '../../storage/database/supabase-client';

@Injectable()
export class BusinessTypesService {
  /**
   * 获取业务类型列表
   */
  async getBusinessTypes(filters?: {
    category?: string;
    isActive?: boolean;
  }) {
    const client = getSupabaseClient();

    let query = client
      .from('business_types')
      .select('*')
      .order('sort_order', { ascending: true });

    if (filters?.category) {
      query = query.eq('category', filters.category);
    }

    if (filters?.isActive !== undefined) {
      query = query.eq('is_active', filters.isActive);
    }

    const { data, error } = await query;

    if (error) {
      throw new Error(`获取业务类型列表失败: ${error.message}`);
    }

    return data || [];
  }

  /**
   * 根据 ID 获取业务类型
   */
  async getBusinessTypeById(id: string) {
    const client = getSupabaseClient();

    const { data, error } = await client
      .from('business_types')
      .select('*')
      .eq('id', id)
      .maybeSingle();

    if (error) {
      throw new Error(`获取业务类型失败: ${error.message}`);
    }

    return data;
  }

  /**
   * 创建业务类型
   */
  async createBusinessType(typeData: {
    name: string;
    category: string;
    icon?: string;
    description?: string;
    sortOrder?: number;
    isActive?: boolean;
  }) {
    const client = getSupabaseClient();

    const { data, error } = await client
      .from('business_types')
      .insert({
        name: typeData.name,
        category: typeData.category,
        icon: typeData.icon,
        description: typeData.description,
        sort_order: typeData.sortOrder || 0,
        is_active: typeData.isActive !== undefined ? typeData.isActive : true,
      })
      .select()
      .single();

    if (error) {
      throw new Error(`创建业务类型失败: ${error.message}`);
    }

    return data;
  }

  /**
   * 更新业务类型
   */
  async updateBusinessType(id: string, typeData: {
    name?: string;
    category?: string;
    icon?: string;
    description?: string;
    sortOrder?: number;
    isActive?: boolean;
  }) {
    const client = getSupabaseClient();

    const updateData: any = {
      updated_at: new Date().toISOString(),
    };

    if (typeData.name !== undefined) {
      updateData.name = typeData.name;
    }
    if (typeData.category !== undefined) {
      updateData.category = typeData.category;
    }
    if (typeData.icon !== undefined) {
      updateData.icon = typeData.icon;
    }
    if (typeData.description !== undefined) {
      updateData.description = typeData.description;
    }
    if (typeData.sortOrder !== undefined) {
      updateData.sort_order = typeData.sortOrder;
    }
    if (typeData.isActive !== undefined) {
      updateData.is_active = typeData.isActive;
    }

    const { data, error } = await client
      .from('business_types')
      .update(updateData)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      throw new Error(`更新业务类型失败: ${error.message}`);
    }

    return data;
  }

  /**
   * 删除业务类型
   */
  async deleteBusinessType(id: string) {
    const client = getSupabaseClient();

    const { data, error } = await client
      .from('business_types')
      .delete()
      .eq('id', id)
      .select()
      .single();

    if (error) {
      throw new Error(`删除业务类型失败: ${error.message}`);
    }

    return data;
  }
}
