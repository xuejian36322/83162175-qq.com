import { useEffect } from 'react'
import Taro from '@tarojs/taro'
import { View, Text } from '@tarojs/components'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import {
  User,
  FileText,
  DollarSign,
  Wrench,
  Microscope,
  ShieldCheck,
  Users,
  ChartBarBig,
  Settings,
  CircleCheck,
  LogOut,
  Bell,
  MapPin,
} from 'lucide-react-taro'
import {
  getCurrentRoles,
  getCurrentRoleNames,
  getCurrentUser,
  canCreateOrder,
  canViewMyTasks,
  canManageUsers,
  canViewStatistics,
  canCreateInvoice,
  canApproveExpense,
  canManageCertificates,
  canReviewReport,
  canLockOrderOnMap,
  UserRole,
} from '@/utils/permission'

// 功能入口配置
interface FunctionItem {
  id: string
  name: string
  icon: any
  color: string
  route: string
  permission: () => boolean
}

// 获取功能入口列表
function getFunctionItems(): FunctionItem[] {
  const items: FunctionItem[] = [
    // 创建订单（业务经理、工程负责人）
    {
      id: 'order_create',
      name: '创建订单',
      icon: FileText,
      color: '#1890ff',
      route: '/pages/order-create/index',
      permission: canCreateOrder,
    },
    // 地图标点（检测人员、安装人员）
    {
      id: 'map_lock',
      name: '地图标点',
      icon: MapPin,
      color: '#52c41a',
      route: '/pages/map-lock/index',
      permission: canLockOrderOnMap,
    },
    // 我的任务（检测人员、安装人员）
    {
      id: 'my_tasks',
      name: '我的任务',
      icon: CircleCheck,
      color: '#52c41a',
      route: '/pages/my-tasks/index',
      permission: canViewMyTasks,
    },
    // 用户管理（超级管理员）
    {
      id: 'user_management',
      name: '用户管理',
      icon: Users,
      color: '#faad14',
      route: '/pages/users/index',
      permission: canManageUsers,
    },
    // 数据统计（管理员、财务、负责人、业务经理）
    {
      id: 'statistics',
      name: '数据统计',
      icon: ChartBarBig,
      color: '#722ed1',
      route: '/pages/statistics/index',
      permission: canViewStatistics,
    },
    // 开票申请（财务、业务经理）
    {
      id: 'invoice',
      name: '开票申请',
      icon: DollarSign,
      color: '#fa8c16',
      route: '/pages/invoice/index',
      permission: canCreateInvoice,
    },
    // 费用审批（财务）
    {
      id: 'expense_approval',
      name: '费用审批',
      icon: DollarSign,
      color: '#f5222d',
      route: '/pages/expense-approval/index',
      permission: canApproveExpense,
    },
    // 工程管理（工程负责人）
    {
      id: 'engineering',
      name: '工程管理',
      icon: Wrench,
      color: '#1890ff',
      route: '/pages/engineering/index',
      permission: () => {
        const roles = getCurrentRoles()
        return roles.includes(UserRole.ENGINEERING_MANAGER)
      },
    },
    // 检测管理（检测负责人）
    {
      id: 'testing',
      name: '检测管理',
      icon: Microscope,
      color: '#52c41a',
      route: '/pages/testing/index',
      permission: () => {
        const roles = getCurrentRoles()
        return roles.includes(UserRole.TESTING_MANAGER)
      },
    },
    // 证书管理（证书编制人员、超级管理员）
    {
      id: 'certificates',
      name: '证书管理',
      icon: ShieldCheck,
      color: '#722ed1',
      route: '/pages/certificates/index',
      permission: canManageCertificates,
    },
    // 报告审核（检测负责人、证书编制人员、超级管理员）
    {
      id: 'report_review',
      name: '报告审核',
      icon: FileText,
      color: '#13c2c2',
      route: '/pages/report-review/index',
      permission: canReviewReport,
    },
    // 系统设置（超级管理员）
    {
      id: 'settings',
      name: '系统设置',
      icon: Settings,
      color: '#8c8c8c',
      route: '/pages/settings/index',
      permission: () => {
        const roles = getCurrentRoles()
        return roles.includes(UserRole.SUPER_ADMIN)
      },
    },
  ]

  // 过滤掉用户没有权限的功能入口
  return items.filter(item => item.permission())
}

export default function IndexPage() {
  const currentRoles = getCurrentRoles()
  const currentRoleName = getCurrentRoleNames()
  const userInfo = getCurrentUser()
  const functionItems = getFunctionItems()

  useEffect(() => {
    // 检查是否已登录
    if (currentRoles.length === 0) {
      Taro.reLaunch({ url: '/pages/login/index' })
    }
  }, [currentRoles])

  const handleNavigate = (route: string) => {
    Taro.navigateTo({ url: route })
  }

  const handleLogout = () => {
    Taro.showModal({
      title: '退出登录',
      content: '确定要退出登录吗？',
      success: (res) => {
        if (res.confirm) {
          Taro.clearStorageSync()
          Taro.reLaunch({ url: '/pages/login/index' })
        }
      },
    })
  }

  const handleSwitchRole = () => {
    Taro.reLaunch({ url: '/pages/role-select/index' })
  }

  return (
    <View className="min-h-screen bg-gray-50">
      {/* 顶部用户信息 */}
      <View className="bg-gradient-to-r from-blue-500 to-blue-600 px-4 py-6">
        <View className="flex items-center gap-4">
          <View className="w-16 h-16 rounded-full bg-white opacity-20 flex items-center justify-center">
            <User size={32} color="#ffffff" />
          </View>
          <View className="flex-1">
            <Text className="block text-white text-lg font-semibold">
              {userInfo?.name || '用户'}
            </Text>
            <Text className="block text-blue-100 text-sm mt-1">
              {currentRoleName}
            </Text>
          </View>
          <Button
            size="sm"
            variant="ghost"
            onClick={handleSwitchRole}
            className="text-white border-white opacity-50"
          >
            <Text className="text-sm">切换角色</Text>
          </Button>
        </View>
      </View>

      {/* 功能入口网格 */}
      <View className="p-4">
        <Text className="block text-gray-900 font-semibold mb-4">功能入口</Text>
        <View className="grid grid-cols-2 gap-3">
          {functionItems.map((item) => {
            const Icon = item.icon
            return (
              <Card
                key={item.id}
                className="overflow-hidden"
                onClick={() => handleNavigate(item.route)}
              >
                <CardContent className="p-4">
                  <View className="flex items-center gap-3">
                    <View
                      className="w-10 h-10 rounded-lg flex items-center justify-center"
                      style={{ backgroundColor: `${item.color}20` }}
                    >
                      <Icon size={20} color={item.color} />
                    </View>
                    <View className="flex-1">
                      <Text className="block text-sm font-medium text-gray-900">
                        {item.name}
                      </Text>
                    </View>
                  </View>
                </CardContent>
              </Card>
            )
          })}
        </View>
      </View>

      {/* 快捷操作 */}
      <View className="px-4 mb-4">
        <Text className="block text-gray-900 font-semibold mb-4">快捷操作</Text>
        <Card>
          <CardContent className="p-4">
            <View className="flex items-center justify-between">
              <View className="flex items-center gap-3">
                <Bell size={20} color="#1890ff" />
                <Text className="text-sm text-gray-700">通知消息</Text>
              </View>
              <View className="w-5 h-5 rounded-full bg-red-500 flex items-center justify-center">
                <Text className="text-white text-xs">3</Text>
              </View>
            </View>
          </CardContent>
        </Card>
      </View>

      {/* 退出登录按钮 */}
      <View className="px-4 pb-8">
        <Button
          variant="outline"
          className="w-full"
          onClick={handleLogout}
        >
          <LogOut size={18} color="#ef4444" />
          <Text className="ml-2">退出登录</Text>
        </Button>
      </View>
    </View>
  )
}
