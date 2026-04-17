import { Controller, Post, Body, HttpCode, HttpStatus } from '@nestjs/common';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  /**
   * 微信登录
   */
  @Post('wx-login')
  @HttpCode(HttpStatus.OK)
  async wxLogin(@Body() body: { code: string }) {
    const { code } = body;

    if (!code) {
      return {
        code: 400,
        msg: '缺少 code 参数',
        data: null,
      };
    }

    try {
      const result = await this.authService.wxLogin(code);
      return {
        code: 200,
        msg: '登录成功',
        data: result,
      };
    } catch (error) {
      return {
        code: 500,
        msg: error.message || '登录失败',
        data: null,
      };
    }
  }

  /**
   * 验证 token
   */
  @Post('validate')
  @HttpCode(HttpStatus.OK)
  async validate(@Body() body: { token: string }) {
    const { token } = body;

    if (!token) {
      return {
        code: 400,
        msg: '缺少 token 参数',
        data: null,
      };
    }

    try {
      const user = await this.authService.validateToken(token);
      return {
        code: 200,
        msg: '验证成功',
        data: user,
      };
    } catch (error) {
      return {
        code: 401,
        msg: error.message || '验证失败',
        data: null,
      };
    }
  }

  /**
   * 更新用户信息
   */
  @Post('update-user')
  @HttpCode(HttpStatus.OK)
  async updateUser(
    @Body()
    body: {
      token: string;
      name?: string;
      phone?: string;
      avatarUrl?: string;
    },
  ) {
    const { token, name, phone, avatarUrl } = body;

    if (!token) {
      return {
        code: 400,
        msg: '缺少 token 参数',
        data: null,
      };
    }

    try {
      const user = await this.authService.updateUserInfo(token, {
        name,
        phone,
        avatarUrl,
      });
      return {
        code: 200,
        msg: '更新成功',
        data: user,
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
