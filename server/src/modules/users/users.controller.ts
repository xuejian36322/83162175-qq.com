import { Controller, Get, Post, Put, Delete, Body, Query, Param, HttpCode, HttpStatus } from '@nestjs/common';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  /**
   * 获取用户列表
   */
  @Get()
  @HttpCode(HttpStatus.OK)
  async getUsers(
    @Query('company') company?: string,
    @Query('role') role?: string,
    @Query('isActive') isActive?: string,
  ) {
    try {
      const filters: any = {};
      if (company) filters.company = company;
      if (role) filters.role = role;
      if (isActive !== undefined) filters.isActive = isActive === 'true';

      const users = await this.usersService.getUsers(filters);
      return {
        code: 200,
        msg: '获取成功',
        data: users,
      };
    } catch (error) {
      return {
        code: 500,
        msg: error.message || '获取失败',
        data: null,
      };
    }
  }

  /**
   * 根据 openId 获取用户
   */
  @Get('by-openid')
  @HttpCode(HttpStatus.OK)
  async getUserByOpenId(@Query('openId') openId: string) {
    try {
      if (!openId) {
        return {
          code: 400,
          msg: '缺少 openId 参数',
          data: null,
        };
      }

      const user = await this.usersService.getUserByOpenId(openId);
      return {
        code: 200,
        msg: '获取成功',
        data: user,
      };
    } catch (error) {
      return {
        code: 500,
        msg: error.message || '获取失败',
        data: null,
      };
    }
  }

  /**
   * 根据 ID 获取用户
   */
  @Get(':id')
  @HttpCode(HttpStatus.OK)
  async getUserById(@Param('id') id: string) {
    try {
      const user = await this.usersService.getUserById(id);
      if (!user) {
        return {
          code: 404,
          msg: '用户不存在',
          data: null,
        };
      }
      return {
        code: 200,
        msg: '获取成功',
        data: user,
      };
    } catch (error) {
      return {
        code: 500,
        msg: error.message || '获取失败',
        data: null,
      };
    }
  }

  /**
   * 创建用户
   */
  @Post()
  @HttpCode(HttpStatus.OK)
  async createUser(@Body() body: {
    openId: string;
    name: string;
    phone?: string;
    avatarUrl?: string;
    role?: string;
    roles?: string[];
    company?: string;
    isActive?: boolean;
  }) {
    try {
      const { openId, name } = body;
      if (!openId || !name) {
        return {
          code: 400,
          msg: '缺少必要参数',
          data: null,
        };
      }

      const user = await this.usersService.createUser(body);
      return {
        code: 200,
        msg: '创建成功',
        data: user,
      };
    } catch (error) {
      return {
        code: 500,
        msg: error.message || '创建失败',
        data: null,
      };
    }
  }

  /**
   * 更新用户
   */
  @Put(':id')
  @HttpCode(HttpStatus.OK)
  async updateUser(
    @Param('id') id: string,
    @Body() body: {
      name?: string;
      phone?: string;
      avatarUrl?: string;
      role?: string;
      roles?: string[];
      company?: string;
      isActive?: boolean;
    },
  ) {
    try {
      const user = await this.usersService.updateUser(id, body);
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

  /**
   * 删除用户
   */
  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  async deleteUser(@Param('id') id: string) {
    try {
      const user = await this.usersService.deleteUser(id);
      return {
        code: 200,
        msg: '删除成功',
        data: user,
      };
    } catch (error) {
      return {
        code: 500,
        msg: error.message || '删除失败',
        data: null,
      };
    }
  }
}
