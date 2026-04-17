import Taro from '@tarojs/taro';

/**
 * 用户角色枚举
 */
export enum UserRole {
  COMPANY_ADMIN = 'company_admin',        // 公司管理员
  FINANCE = 'finance',                   // 财务
  ENGINEERING_DIRECTOR = 'engineering_director', // 工程部负责人
  TESTING_DIRECTOR = 'testing_director', // 检测部负责人
  CERTIFICATE_MANAGER = 'certificate_manager', // 检测证书管理员
  BUSINESS_ASSISTANT = 'business_assistant',   // 业务助理
  ENGINEERING_BUSINESS_1 = 'engineering_business_1', // 工程公司业务1部
  ENGINEERING_BUSINESS_2 = 'engineering_business_2', // 工程公司业务2部
  METROLOGY_BUSINESS_1 = 'metrology_business_1',   // 计量公司业务1部
  INSTALLER = 'installer',             // 安装工
  TESTER = 'tester',                   // 检测员
}

/**
 * 获取当前用户角色
 */
export function getCurrentRole(): UserRole | null {
  return Taro.getStorageSync('selectedRole') || null;
}

/**
 * 获取当前用户角色名称
 */
export function getCurrentRoleName(): string {
  return Taro.getStorageSync('selectedRoleName') || '';
}

/**
 * 获取当前用户信息
 */
export function getCurrentUser(): any {
  return Taro.getStorageSync('userInfo') || null;
}

/**
 * 检查用户是否有指定角色
 */
export function hasRole(role: UserRole): boolean {
  const currentRole = getCurrentRole();
  return currentRole === role;
}

/**
 * 检查用户是否有任一指定角色
 */
export function hasAnyRole(roles: UserRole[]): boolean {
  const currentRole = getCurrentRole();
  return roles.includes(currentRole as UserRole);
}

/**
 * 检查用户是否是管理员
 */
export function isAdmin(): boolean {
  return hasRole(UserRole.COMPANY_ADMIN);
}

/**
 * 检查用户是否是财务
 */
export function isFinance(): boolean {
  return hasRole(UserRole.FINANCE);
}

/**
 * 检查用户是否是工程部负责人
 */
export function isEngineeringDirector(): boolean {
  return hasRole(UserRole.ENGINEERING_DIRECTOR);
}

/**
 * 检查用户是否是检测部负责人
 */
export function isTestingDirector(): boolean {
  return hasRole(UserRole.TESTING_DIRECTOR);
}

/**
 * 检查用户是否是证书管理员
 */
export function isCertificateManager(): boolean {
  return hasRole(UserRole.CERTIFICATE_MANAGER);
}

/**
 * 检查用户是否是业务人员
 */
export function isBusinessStaff(): boolean {
  return hasAnyRole([
    UserRole.BUSINESS_ASSISTANT,
    UserRole.ENGINEERING_BUSINESS_1,
    UserRole.ENGINEERING_BUSINESS_2,
    UserRole.METROLOGY_BUSINESS_1,
  ]);
}

/**
 * 检查用户是否是安装工
 */
export function isInstaller(): boolean {
  return hasRole(UserRole.INSTALLER);
}

/**
 * 检查用户是否是检测员
 */
export function isTester(): boolean {
  return hasRole(UserRole.TESTER);
}

/**
 * 检查用户是否是执行人员（安装工或检测员）
 */
export function isExecutor(): boolean {
  return isInstaller() || isTester();
}

/**
 * 检查用户是否可以查看所有订单
 */
export function canViewAllOrders(): boolean {
  return hasAnyRole([
    UserRole.COMPANY_ADMIN,
    UserRole.FINANCE,
    UserRole.ENGINEERING_DIRECTOR,
    UserRole.TESTING_DIRECTOR,
    UserRole.CERTIFICATE_MANAGER,
  ]);
}

/**
 * 检查用户是否可以创建订单
 */
export function canCreateOrder(): boolean {
  return hasAnyRole([
    UserRole.COMPANY_ADMIN,
    UserRole.BUSINESS_ASSISTANT,
    UserRole.ENGINEERING_BUSINESS_1,
    UserRole.ENGINEERING_BUSINESS_2,
    UserRole.METROLOGY_BUSINESS_1,
  ]);
}

/**
 * 检查用户是否可以编辑订单
 */
export function canEditOrder(): boolean {
  return hasAnyRole([
    UserRole.COMPANY_ADMIN,
    UserRole.BUSINESS_ASSISTANT,
    UserRole.ENGINEERING_BUSINESS_1,
    UserRole.ENGINEERING_BUSINESS_2,
    UserRole.METROLOGY_BUSINESS_1,
    UserRole.ENGINEERING_DIRECTOR,
    UserRole.TESTING_DIRECTOR,
  ]);
}

/**
 * 检查用户是否可以删除订单
 */
export function canDeleteOrder(): boolean {
  return isAdmin();
}

/**
 * 检查用户是否可以创建开票申请
 */
export function canCreateInvoice(): boolean {
  return hasAnyRole([UserRole.COMPANY_ADMIN, UserRole.FINANCE]);
}

/**
 * 检查用户是否可以审批费用
 */
export function canApproveExpense(): boolean {
  return hasAnyRole([UserRole.COMPANY_ADMIN, UserRole.FINANCE]);
}

/**
 * 检查用户是否可以分配任务
 */
export function canAssignTask(): boolean {
  return hasAnyRole([
    UserRole.COMPANY_ADMIN,
    UserRole.ENGINEERING_DIRECTOR,
    UserRole.TESTING_DIRECTOR,
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
  return isAdmin();
}

/**
 * 检查用户是否可以查看数据统计
 */
export function canViewStatistics(): boolean {
  return hasAnyRole([
    UserRole.COMPANY_ADMIN,
    UserRole.FINANCE,
    UserRole.ENGINEERING_DIRECTOR,
    UserRole.TESTING_DIRECTOR,
    UserRole.ENGINEERING_BUSINESS_1,
    UserRole.ENGINEERING_BUSINESS_2,
    UserRole.METROLOGY_BUSINESS_1,
  ]);
}

/**
 * 检查用户是否可以管理证书
 */
export function canManageCertificates(): boolean {
  return hasAnyRole([UserRole.COMPANY_ADMIN, UserRole.CERTIFICATE_MANAGER]);
}

/**
 * 检查用户是否可以审核报告
 */
export function canReviewReport(): boolean {
  return hasAnyRole([
    UserRole.COMPANY_ADMIN,
    UserRole.TESTING_DIRECTOR,
    UserRole.CERTIFICATE_MANAGER,
  ]);
}

/**
 * 获取角色显示名称
 */
export function getRoleDisplayName(role: UserRole): string {
  const roleNames: Record<UserRole, string> = {
    [UserRole.COMPANY_ADMIN]: '公司管理员',
    [UserRole.FINANCE]: '财务',
    [UserRole.ENGINEERING_DIRECTOR]: '工程部负责人',
    [UserRole.TESTING_DIRECTOR]: '检测部负责人',
    [UserRole.CERTIFICATE_MANAGER]: '检测证书管理员',
    [UserRole.BUSINESS_ASSISTANT]: '业务助理',
    [UserRole.ENGINEERING_BUSINESS_1]: '工程公司业务1部',
    [UserRole.ENGINEERING_BUSINESS_2]: '工程公司业务2部',
    [UserRole.METROLOGY_BUSINESS_1]: '计量公司业务1部',
    [UserRole.INSTALLER]: '安装工',
    [UserRole.TESTER]: '检测员',
  };
  return roleNames[role] || role;
}
