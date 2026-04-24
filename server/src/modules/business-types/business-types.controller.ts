import { Controller, Get, Post, Put, Delete, Body, Param, Query, HttpCode, HttpStatus } from '@nestjs/common';
import { BusinessTypesService } from './business-types.service';

@Controller('business-types')
export class BusinessTypesController {
  constructor(private readonly businessTypesService: BusinessTypesService) {}

  /**
   * 获取业务类型列表
   */
  @Get()
  @HttpCode(HttpStatus.OK)
  async getBusinessTypes(
    @Query('category') category?: string,
    @Query('isActive') isActive?: string,
  ) {
    try {
      const filters: any = {};
      if (category) filters.category = category;
      if (isActive !== undefined) filters.isActive = isActive === 'true';

      const types = await this.businessTypesService.getBusinessTypes(filters);
      return {
        code: 200,
        msg: '获取成功',
        data: types,
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
   * 根据 ID 获取业务类型
   */
  @Get(':id')
  @HttpCode(HttpStatus.OK)
  async getBusinessTypeById(@Param('id') id: string) {
    try {
      const type = await this.businessTypesService.getBusinessTypeById(id);
      if (!type) {
        return {
          code: 404,
          msg: '业务类型不存在',
          data: null,
        };
      }
      return {
        code: 200,
        msg: '获取成功',
        data: type,
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
   * 创建业务类型
   */
  @Post()
  @HttpCode(HttpStatus.OK)
  async createBusinessType(@Body() body: {
    name: string;
    category: string;
    icon?: string;
    description?: string;
    sortOrder?: number;
    isActive?: boolean;
  }) {
    try {
      const { name, category } = body;
      if (!name || !category) {
        return {
          code: 400,
          msg: '缺少必要参数',
          data: null,
        };
      }

      const type = await this.businessTypesService.createBusinessType(body);
      return {
        code: 200,
        msg: '创建成功',
        data: type,
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
   * 更新业务类型
   */
  @Put(':id')
  @HttpCode(HttpStatus.OK)
  async updateBusinessType(
    @Param('id') id: string,
    @Body() body: {
      name?: string;
      category?: string;
      icon?: string;
      description?: string;
      sortOrder?: number;
      isActive?: boolean;
    },
  ) {
    try {
      const type = await this.businessTypesService.updateBusinessType(id, body);
      return {
        code: 200,
        msg: '更新成功',
        data: type,
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
   * 删除业务类型
   */
  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  async deleteBusinessType(@Param('id') id: string) {
    try {
      const type = await this.businessTypesService.deleteBusinessType(id);
      return {
        code: 200,
        msg: '删除成功',
        data: type,
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
