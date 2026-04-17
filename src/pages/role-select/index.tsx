import { useState } from 'react'
import Taro from '@tarojs/taro'
import { View, Text } from '@tarojs/components'
import { Building2, DollarSign, Wrench, ShieldCheck, FileCheck, Users, Gauge, CircleCheck } from 'lucide-react-taro'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'

// 新角色配置（8个角色）
const ROLES = [
  {
    value: 'super_admin',
    name: '超级管理员',
    description: '系统最高权限，管理所有业务和用户',
    icon: Building2,
    color: '#dc2626',
  },
  {
    value: 'testing_manager',
    name: '检测负责人',
    description: '检测团队业务管理、审批、工作调度',
    icon: ShieldCheck,
    color: '#059669',
  },
  {
    value: 'engineering_manager',
    name: '工程负责人',
    description: '工程团队业务管理、审批、工作调度',
    icon: Wrench,
    color: '#0891b2',
  },
  {
    value: 'finance',
    name: '财务',
    description: '费用审批、开票处理、回款管理',
    icon: DollarSign,
    color: '#ea580c',
  },
  {
    value: 'business_manager',
    name: '业务经理',
    description: '客户开发、订单录入、跟进执行',
    icon: Users,
    color: '#2563eb',
  },
  {
    value: 'testing_worker',
    name: '检测人员',
    description: '地图锁定订单、执行检测、填写结果',
    icon: Gauge,
    color: '#10b981',
  },
  {
    value: 'installation_worker',
    name: '安装人员',
    description: '地图锁定订单、执行安装、填写结果',
    icon: Wrench,
    color: '#f59e0b',
  },
  {
    value: 'certificate_maker',
    name: '证书编制人员',
    description: '证书编制、快递寄送、运单号管理',
    icon: FileCheck,
    color: '#7c3aed',
  },
]

export default function RoleSelectPage() {
  const [selectedRoles, setSelectedRoles] = useState<string[]>([])

  const handleRoleToggle = (roleValue: string) => {
    if (selectedRoles.includes(roleValue)) {
      // 取消选择（至少保留一个）
      if (selectedRoles.length > 1) {
        setSelectedRoles(selectedRoles.filter(r => r !== roleValue))
      }
    } else {
      // 添加选择
      setSelectedRoles([...selectedRoles, roleValue])
    }
  }

  const handleConfirm = () => {
    if (selectedRoles.length === 0) {
      Taro.showToast({
        title: '请选择角色',
        icon: 'none',
      })
      return
    }

    const selectedRoleConfigs = ROLES.filter(r => selectedRoles.includes(r.value))

    // 保存角色到本地存储
    Taro.setStorageSync('selectedRoles', selectedRoles)
    Taro.setStorageSync('selectedRoleNames', selectedRoleConfigs.map(r => r.name).join('、'))

    Taro.showToast({
      title: '选择成功',
      icon: 'success',
    })

    // 跳转到首页
    setTimeout(() => {
      Taro.reLaunch({
        url: '/pages/index/index',
      })
    }, 1500)
  }

  return (
    <View className="min-h-screen bg-gray-50">
      {/* 顶部标题 */}
      <View className="bg-gradient-to-r from-blue-500 to-blue-600 px-4 py-6">
        <Text className="block text-2xl font-bold text-white text-center">选择角色</Text>
        <Text className="block text-sm text-blue-100 text-center mt-2">支持多选，一人可担任多个角色</Text>
      </View>

      {/* 角色列表 */}
      <View className="p-4 pb-32">
        <View className="space-y-3">
          {ROLES.map((role) => {
            const Icon = role.icon
            const isSelected = selectedRoles.includes(role.value)

            return (
              <Card
                key={role.value}
                className={`overflow-hidden transition-all ${
                  isSelected ? 'ring-2 ring-blue-500 bg-blue-50' : ''
                }`}
                onClick={() => handleRoleToggle(role.value)}
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
                    {isSelected ? (
                      <View className="flex items-center justify-center w-6 h-6 rounded-full bg-blue-500">
                        <CircleCheck size={14} color="#ffffff" />
                      </View>
                    ) : (
                      <View className="w-6 h-6 rounded-full border-2 border-gray-300" />
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
        <Text className="block text-sm text-gray-500 mb-3">
          已选择 {selectedRoles.length} 个角色
        </Text>
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
