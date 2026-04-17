import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { userRoleEnum } from '../../storage/database/shared/schema';

/**
 * 角色守卫 - 用于保护需要特定角色的路由
 *
 * 使用方法：
 * @Controller('users')
 * @UseGuards(JwtAuthGuard, RolesGuard)
 * @Roles('company_admin', 'finance')
 * export class UsersController {}
 */
@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    // 获取装饰器中定义的角色要求
    const requiredRoles = this.reflector.getAllAndOverride<string[]>('roles', [
      context.getHandler(),
      context.getClass(),
    ]);

    // 如果没有定义角色要求，允许访问
    if (!requiredRoles || requiredRoles.length === 0) {
      return true;
    }

    // 从请求中获取用户信息
    const request = context.switchToHttp().getRequest();
    const user = request.user;

    // 如果没有用户信息，拒绝访问
    if (!user || !user.role) {
      throw new ForbiddenException('未授权访问');
    }

    // 检查用户角色是否在允许的角色列表中
    const hasRole = requiredRoles.some((role) => user.role === role);

    if (!hasRole) {
      throw new ForbiddenException('权限不足');
    }

    return true;
  }
}
