import Taro from '@tarojs/taro';

/**
 * 用户角色枚举（新需求：8个角色）
 */
export enum UserRole {
  SUPER_ADMIN = 'super_admin',          // 超级管理员（张宇）
  TESTING_MANAGER = 'testing_manager',  // 检测负责人（袁昭）
  ENGINEERING_MANAGER = 'engineering_manager', // 工程负责人（袁勃，兼业务经理）
  FINANCE = 'finance',                  // 财务
  BUSINESS_MANAGER = 'business_manager', // 业务经理（肖兴涛、陈俭等）
  TESTING_WORKER = 'testing_worker',    // 检测人员
  INSTALLATION_WORKER = 'installation_worker', // 安装人员
  CERTIFICATE_MAKER = 'certificate_maker',     // 证书编制人员
}

/**
 * 获取当前用户角色列表
 */
export function getCurrentRoles(): UserRole[] {
  const roles = Taro.getStorageSync('selectedRoles') || [];
  return Array.isArray(roles) ? roles : [roles];
}

/**
 * 获取当前用户角色名称列表
 */
export function getCurrentRoleNames(): string {
  return Taro.getStorageSync('selectedRoleNames') || '';
}

/**
 * 获取当前用户信息
 */
export function getCurrentUser(): any {
  return Taro.getStorageSync('userInfo') || null;
}

/**
 * 检查用户是否有指定角色（支持多角色）
 */
export function hasRole(role: UserRole): boolean {
  const currentRoles = getCurrentRoles();
  return currentRoles.includes(role);
}

/**
 * 检查用户是否有任一指定角色
 */
export function hasAnyRole(roles: UserRole[]): boolean {
  const currentRoles = getCurrentRoles();
  return roles.some(role => currentRoles.includes(role));
}

/**
 * 检查用户是否有所有指定角色
 */
export function hasAllRoles(roles: UserRole[]): boolean {
  const currentRoles = getCurrentRoles();
  return roles.every(role => currentRoles.includes(role));
}

/**
 * 检查用户是否是超级管理员
 */
export function isSuperAdmin(): boolean {
  return hasRole(UserRole.SUPER_ADMIN);
}

/**
 * 检查用户是否是检测负责人
 */
export function isTestingManager(): boolean {
  return hasRole(UserRole.TESTING_MANAGER);
}

/**
 * 检查用户是否是工程负责人
 */
export function isEngineeringManager(): boolean {
  return hasRole(UserRole.ENGINEERING_MANAGER);
}

/**
 * 检查用户是否是财务
 */
export function isFinance(): boolean {
  return hasRole(UserRole.FINANCE);
}

/**
 * 检查用户是否是业务经理
 */
export function isBusinessManager(): boolean {
  return hasRole(UserRole.BUSINESS_MANAGER);
}

/**
 * 检查用户是否是检测人员
 */
export function isTestingWorker(): boolean {
  return hasRole(UserRole.TESTING_WORKER);
}

/**
 * 检查用户是否是安装人员
 */
export function isInstallationWorker(): boolean {
  return hasRole(UserRole.INSTALLATION_WORKER);
}

/**
 * 检查用户是否是证书编制人员
 */
export function isCertificateMaker(): boolean {
  return hasRole(UserRole.CERTIFICATE_MAKER);
}

/**
 * 检查用户是否是执行人员（检测人员或安装人员）
 */
export function isExecutor(): boolean {
  return isTestingWorker() || isInstallationWorker();
}

/**
 * 检查用户是否是负责人（检测负责人或工程负责人）
 */
export function isManager(): boolean {
  return isTestingManager() || isEngineeringManager();
}

/**
 * 检查用户是否可以查看所有订单
 */
export function canViewAllOrders(): boolean {
  return hasAnyRole([
    UserRole.SUPER_ADMIN,
    UserRole.FINANCE,
    UserRole.TESTING_MANAGER,
    UserRole.ENGINEERING_MANAGER,
    UserRole.CERTIFICATE_MAKER,
  ]);
}

/**
 * 检查用户是否可以创建订单
 */
export function canCreateOrder(): boolean {
  return hasAnyRole([
    UserRole.SUPER_ADMIN,
    UserRole.BUSINESS_MANAGER,
    UserRole.ENGINEERING_MANAGER, // 兼业务经理
  ]);
}

/**
 * 检查用户是否可以编辑订单
 */
export function canEditOrder(): boolean {
  return hasAnyRole([
    UserRole.SUPER_ADMIN,
    UserRole.BUSINESS_MANAGER,
    UserRole.ENGINEERING_MANAGER,
    UserRole.TESTING_MANAGER,
  ]);
}

/**
 * 检查用户是否可以删除订单
 */
export function canDeleteOrder(): boolean {
  return isSuperAdmin();
}

/**
 * 检查用户是否可以创建开票申请
 */
export function canCreateInvoice(): boolean {
  return hasAnyRole([UserRole.SUPER_ADMIN, UserRole.FINANCE, UserRole.BUSINESS_MANAGER]);
}

/**
 * 检查用户是否可以审批费用
 */
export function canApproveExpense(): boolean {
  return hasAnyRole([UserRole.SUPER_ADMIN, UserRole.FINANCE]);
}

/**
 * 检查用户是否可以申请费用
 */
export function canApplyExpense(): boolean {
  return hasAnyRole([
    UserRole.SUPER_ADMIN,
    UserRole.BUSINESS_MANAGER,
    UserRole.ENGINEERING_MANAGER,
    UserRole.TESTING_MANAGER,
  ]);
}

/**
 * 检查用户是否可以分配任务
 */
export function canAssignTask(): boolean {
  return hasAnyRole([
    UserRole.SUPER_ADMIN,
    UserRole.TESTING_MANAGER,
    UserRole.ENGINEERING_MANAGER,
  ]);
}

/**
 * 检查用户是否可以查看我的任务
 */
export function canViewMyTasks(): boolean {
  return isExecutor();
}

/**
 * 检查用户是否可以管理用户
 */
export function canManageUsers(): boolean {
  return isSuperAdmin();
}

/**
 * 检查用户是否可以查看数据统计
 */
export function canViewStatistics(): boolean {
  return hasAnyRole([
    UserRole.SUPER_ADMIN,
    UserRole.FINANCE,
    UserRole.TESTING_MANAGER,
    UserRole.ENGINEERING_MANAGER,
    UserRole.BUSINESS_MANAGER,
  ]);
}

/**
 * 检查用户是否可以管理证书
 */
export function canManageCertificates(): boolean {
  return hasAnyRole([UserRole.SUPER_ADMIN, UserRole.CERTIFICATE_MAKER]);
}

/**
 * 检查用户是否可以审核报告
 */
export function canReviewReport(): boolean {
  return hasAnyRole([
    UserRole.SUPER_ADMIN,
    UserRole.TESTING_MANAGER,
    UserRole.CERTIFICATE_MAKER,
  ]);
}

/**
 * 检查用户是否可以在地图上锁定订单
 */
export function canLockOrderOnMap(): boolean {
  return isExecutor();
}

/**
 * 检查用户是否可以查看工费字段
 */
export function canViewLaborFee(): boolean {
  return hasAnyRole([UserRole.SUPER_ADMIN, UserRole.ENGINEERING_MANAGER]);
}

/**
 * 获取角色显示名称
 */
export function getRoleDisplayName(role: UserRole): string {
  const roleNames: Record<UserRole, string> = {
    [UserRole.SUPER_ADMIN]: '超级管理员',
    [UserRole.TESTING_MANAGER]: '检测负责人',
    [UserRole.ENGINEERING_MANAGER]: '工程负责人',
    [UserRole.FINANCE]: '财务',
    [UserRole.BUSINESS_MANAGER]: '业务经理',
    [UserRole.TESTING_WORKER]: '检测人员',
    [UserRole.INSTALLATION_WORKER]: '安装人员',
    [UserRole.CERTIFICATE_MAKER]: '证书编制人员',
  };
  return roleNames[role] || role;
}
