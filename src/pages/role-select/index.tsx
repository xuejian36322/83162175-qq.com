import { useState } from 'react'
import Taro from '@tarojs/taro'
import { View, Text } from '@tarojs/components'
import { Building2, DollarSign, Wrench, ShieldCheck, FileCheck, User, Users, Gauge, CircleCheck } from 'lucide-react-taro'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'

// 角色配置
const ROLES = [
  {
    value: 'company_admin',
    name: '公司管理员',
    description: '系统最高权限，管理所有业务和用户',
    icon: Building2,
    color: '#dc2626',
  },
  {
    value: 'finance',
    name: '财务',
    description: '负责开票、费用审批、资金管理',
    icon: DollarSign,
    color: '#ea580c',
  },
  {
    value: 'engineering_director',
    name: '工程部负责人',
    description: '负责工程业务管理、审批和监督',
    icon: Wrench,
    color: '#0891b2',
  },
  {
    value: 'testing_director',
    name: '检测部负责人',
    description: '负责检测业务管理、报告审核',
    icon: ShieldCheck,
    color: '#059669',
  },
  {
    value: 'certificate_manager',
    name: '检测证书管理员',
    description: '负责证书编制、报告管理',
    icon: FileCheck,
    color: '#7c3aed',
  },
  {
    value: 'business_assistant',
    name: '业务助理',
    description: '辅助业务办理、资料整理',
    icon: User,
    color: '#2563eb',
  },
  {
    value: 'engineering_business_1',
    name: '工程公司业务1部',
    description: '负责工程公司1部的业务拓展',
    icon: Users,
    color: '#4338ca',
  },
  {
    value: 'engineering_business_2',
    name: '工程公司业务2部',
    description: '负责工程公司2部的业务拓展',
    icon: Users,
    color: '#4338ca',
  },
  {
    value: 'metrology_business_1',
    name: '计量公司业务1部',
    description: '负责计量公司1部的业务拓展',
    icon: Gauge,
    color: '#0891b2',
  },
  {
    value: 'installer',
    name: '安装工',
    description: '负责燃气设备安装、管道施工等工程任务',
    icon: Wrench,
    color: '#f59e0b',
  },
  {
    value: 'tester',
    name: '检测员',
    description: '负责各类设备的计量检测、数据采集和报告撰写',
    icon: CircleCheck,
    color: '#10b981',
  },
]

export default function RoleSelectPage() {
  
  const [selectedRole, setSelectedRole] = useState<string>('')

  const handleRoleSelect = (roleValue: string) => {
    setSelectedRole(roleValue)
  }

  const handleConfirm = () => {
    if (!selectedRole) {
      Taro.showToast({
        title: '请选择角色',
        icon: 'none',
      })
      return
    }

    const selectedRoleConfig = ROLES.find(r => r.value === selectedRole)

    // 保存角色到本地存储
    Taro.setStorageSync('selectedRole', selectedRole)
    Taro.setStorageSync('selectedRoleName', selectedRoleConfig?.name || '')

    // 跳转到首页
    Taro.reLaunch({
      url: '/pages/index/index',
    })
  }

  return (
    <View className="min-h-screen bg-gray-50">
      {/* 顶部标题 */}
      <View className="bg-gradient-to-r from-blue-500 to-blue-600 px-4 py-6">
        <Text className="block text-2xl font-bold text-white text-center">选择角色</Text>
        <Text className="block text-sm text-blue-100 text-center mt-2">请选择您当前使用的角色</Text>
      </View>

      {/* 角色列表 */}
      <View className="p-4 pb-32">
        <View className="space-y-3">
          {ROLES.map((role) => {
            const Icon = role.icon
            const isSelected = selectedRole === role.value

            return (
              <Card
                key={role.value}
                className={`overflow-hidden transition-all ${
                  isSelected ? 'ring-2 ring-blue-500 bg-blue-50' : ''
                }`}
                onClick={() => handleRoleSelect(role.value)}
              >
                <CardContent className="p-4">
                  <View className="flex items-center gap-4">
                    {/* 角色图标 */}
                    <View
                      className="flex items-center justify-center w-12 h-12 rounded-xl"
                      style={{ backgroundColor: `${role.color}15` }}
                    >
                      <Icon size={24} color={role.color} />
                    </View>

                    {/* 角色信息 */}
                    <View className="flex-1">
                      <Text className="block text-base font-semibold text-gray-900">
                        {role.name}
                      </Text>
                      <Text className="block text-sm text-gray-500 mt-1">
                        {role.description}
                      </Text>
                    </View>

                    {/* 选中标记 */}
                    {isSelected && (
                      <View className="flex items-center justify-center w-6 h-6 rounded-full bg-blue-500">
                        <Text className="text-white text-xs">✓</Text>
                      </View>
                    )}
                  </View>
                </CardContent>
              </Card>
            )
          })}
        </View>
      </View>

      {/* 底部确认按钮 */}
      <View style={{ position: 'fixed', bottom: 0, left: 0, right: 0, padding: '16px', backgroundColor: '#ffffff', borderTop: '1px solid #e5e7eb', zIndex: 100 }}>
        <Button
          className="w-full bg-blue-500 text-white rounded-xl py-4 text-base font-medium"
          onClick={handleConfirm}
        >
          确认选择
        </Button>
      </View>
    </View>
  )
}
