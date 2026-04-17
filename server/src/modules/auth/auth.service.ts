import { Injectable, UnauthorizedException } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { lastValueFrom } from 'rxjs';
import { getSupabaseClient } from '../../storage/database/supabase-client';

interface WxSessionResponse {
  openid: string;
  session_key: string;
  unionid?: string;
  errcode?: number;
  errmsg?: string;
}

@Injectable()
export class AuthService {
  constructor(
    private httpService: HttpService,
    private configService: ConfigService,
  ) {}

  /**
   * 微信登录 - code2Session
   */
  async wxLogin(code: string): Promise<any> {
    const appId = this.configService.get<string>('WX_APP_ID');
    const secret = this.configService.get<string>('WX_APP_SECRET');

    if (!appId || !secret) {
      throw new UnauthorizedException('微信配置未完成');
    }

    // 调用微信 code2Session 接口
    const url = `https://api.weixin.qq.com/sns/jscode2session?appid=${appId}&secret=${secret}&js_code=${code}&grant_type=authorization_code`;

    try {
      const { data } = await lastValueFrom(
        this.httpService.get<WxSessionResponse>(url),
      );

      // 检查微信 API 是否返回错误
      if (data.errcode) {
        throw new UnauthorizedException(
          `微信登录失败: ${data.errmsg || '未知错误'}`,
        );
      }

      const { openid, session_key } = data;

      if (!openid) {
        throw new UnauthorizedException('未获取到 openid');
      }

      // 查询或创建用户
      const client = getSupabaseClient();
      const { data: users, error: queryError } = await client
        .from('users')
        .select('*')
        .eq('open_id', openid)
        .maybeSingle();

      if (queryError) {
        throw new Error(`查询用户失败: ${queryError.message}`);
      }

      let user;
      if (!users) {
        // 创建新用户
        const { data: newUser, error: insertError } = await client
          .from('users')
          .insert({
            open_id: openid,
            name: `用户${openid.substring(0, 8)}`,
            role: 'business_manager',
            company: 'sanheng_jiliang',
            is_active: true,
          })
          .select()
          .single();

        if (insertError) {
          throw new Error(`创建用户失败: ${insertError.message}`);
        }

        user = newUser;
      } else {
        user = users;
      }

      // 生成 token（使用 openid 作为 token，简化实现）
      const token = openid;

      return {
        token,
        user: {
          id: user.id,
          openId: user.open_id,
          name: user.name,
          phone: user.phone,
          avatarUrl: user.avatar_url,
          role: user.role,
          company: user.company,
        },
      };
    } catch (error) {
      if (error instanceof UnauthorizedException) {
        throw error;
      }
      throw new Error(`登录失败: ${error.message}`);
    }
  }

  /**
   * 验证 token
   */
  async validateToken(token: string): Promise<any> {
    if (!token) {
      throw new UnauthorizedException('未提供 token');
    }

    const client = getSupabaseClient();
    const { data: user, error } = await client
      .from('users')
      .select('*')
      .eq('open_id', token)
      .maybeSingle();

    if (error) {
      throw new Error(`验证失败: ${error.message}`);
    }

    if (!user) {
      throw new UnauthorizedException('无效的 token');
    }

    if (!user.is_active) {
      throw new UnauthorizedException('账号已被禁用');
    }

    return user;
  }

  /**
   * 更新用户信息
   */
  async updateUserInfo(
    token: string,
    userInfo: {
      name?: string;
      phone?: string;
      avatarUrl?: string;
    },
  ): Promise<any> {
    const user = await this.validateToken(token);

    const client = getSupabaseClient();
    const { data: updatedUser, error } = await client
      .from('users')
      .update({
        name: userInfo.name,
        phone: userInfo.phone,
        avatar_url: userInfo.avatarUrl,
        updated_at: new Date().toISOString(),
      })
      .eq('id', user.id)
      .select()
      .single();

    if (error) {
      throw new Error(`更新失败: ${error.message}`);
    }

    return updatedUser;
  }
}
