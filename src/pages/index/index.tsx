import { View, Text } from '@tarojs/components'
import Taro from '@tarojs/taro'
import { useState, useEffect } from 'react'
import { User, ClipboardList, FileText, DollarSign, ChartBarBig } from 'lucide-react-taro'
import { Button } from '@/components/ui/button'

export default function IndexPage() {
  const [userInfo, setUserInfo] = useState<any>(null)

  useEffect(() => {
    checkLogin()
  }, [])

  const checkLogin = () => {
    const token = Taro.getStorageSync('token')
    const user = Taro.getStorageSync('userInfo')

    if (!token || !user) {
      Taro.redirectTo({
        url: '/pages/login/index',
      })
      return
    }

    setUserInfo(user)
  }

  const handleLogout = () => {
    Taro.clearStorageSync()
    Taro.redirectTo({
      url: '/pages/login/index',
    })
  }

  const menuItems = [
    {
      icon: ClipboardList,
      title: '订单台账',
      description: '管理所有业务订单',
      color: '#1890ff',
      bgColor: 'bg-blue-100',
      status: '开发中',
    },
    {
      icon: FileText,
      title: '开票申请',
      description: '提交开票申请',
      color: '#52c41a',
      bgColor: 'bg-green-100',
      status: '开发中',
    },
    {
      icon: DollarSign,
      title: '费用申请',
      description: '居间费/工费/运费',
      color: '#fa8c16',
      bgColor: 'bg-orange-100',
      status: '开发中',
    },
    {
      icon: ChartBarBig,
      title: '业绩统计',
      description: '多维度数据分析',
      color: '#722ed1',
      bgColor: 'bg-purple-100',
      status: '开发中',
    },
  ]

  if (!userInfo) {
    return (
      <View className="flex items-center justify-center min-h-screen bg-gray-50">
        <Text className="block text-gray-500">加载中...</Text>
      </View>
    )
  }

  return (
    <View className="min-h-screen bg-gray-50 pb-4">
      {/* 顶部用户信息卡片 */}
      <View className="bg-white p-6 mb-4">
        <View className="flex items-center justify-between">
          <View className="flex items-center">
            <View className="w-16 h-16 rounded-full bg-blue-100 flex items-center justify-center mr-4">
              <User size={32} color="#1890ff" />
            </View>
            <View>
              <Text className="block text-xl font-bold text-gray-800">
                {userInfo.name}
              </Text>
              <Text className="block text-sm text-gray-500">
                {userInfo.company === 'sanheng_jiliang' ? '叁恒计量' : '叁恒智安'}
              </Text>
            </View>
          </View>
          <Button
            size="sm"
            variant="outline"
            onClick={handleLogout}
          >
            退出
          </Button>
        </View>

        <View className="mt-4 pt-4 border-t border-gray-100">
          <View className="flex items-center">
            <View className="w-2 h-2 rounded-full bg-green-500 mr-2" />
            <Text className="block text-sm text-gray-600">当前为测试模式</Text>
          </View>
        </View>
      </View>

      {/* 功能模块 */}
      <View className="px-4">
        <Text className="block text-lg font-semibold text-gray-800 mb-4">
          功能模块
        </Text>

        <View className="grid grid-cols-2 gap-4">
          {menuItems.map((item, index) => {
            const Icon = item.icon
            return (
              <View
                key={index}
                className="bg-white rounded-xl p-4 shadow-sm"
              >
                <View className={`w-12 h-12 rounded-lg ${item.bgColor} flex items-center justify-center mb-3`}>
                  <Icon size={24} color={item.color} />
                </View>
                <Text className="block text-base font-semibold text-gray-800 mb-1">
                  {item.title}
                </Text>
                <Text className="block text-xs text-gray-500 mb-2">
                  {item.description}
                </Text>
                <View className="inline-block px-2 py-1 bg-gray-100 rounded">
                  <Text className="block text-xs text-gray-500">{item.status}</Text>
                </View>
              </View>
            )
          })}
        </View>
      </View>

      {/* 开发说明 */}
      <View className="mx-4 mt-6 bg-orange-50 border border-orange-200 rounded-xl p-4">
        <Text className="block text-sm font-semibold text-orange-800 mb-2">
          💡 开发进度说明
        </Text>
        <Text className="block text-xs text-orange-700 leading-relaxed">
          已完成基础架构：✅ 数据库设计 + ✅ 用户认证系统
          {'\n\n'}
          待开发模块：订单管理、业务流转、开票申请、费用申请、业绩统计
          {'\n\n'}
          如需继续开发，请告知优先级
        </Text>
      </View>
    </View>
  )
}
