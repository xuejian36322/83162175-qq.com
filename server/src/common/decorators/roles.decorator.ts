import { SetMetadata } from '@nestjs/common';
import { userRoleEnum } from '../../storage/database/shared/schema';

/**
 * 角色装饰器 - 用于标记路由所需的角色
 *
 * 使用示例：
 * @Post()
 * @Roles('company_admin', 'finance')
 * async createOrder(@Body() dto: CreateOrderDto) {
 *   // ...
 * }
 */
export const ROLES_KEY = 'roles';
export const Roles = (...roles: string[]) => SetMetadata(ROLES_KEY, roles);
