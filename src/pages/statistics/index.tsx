import { useState, useEffect } from 'react'
import Taro from '@tarojs/taro'
import { View, Text, ScrollView } from '@tarojs/components'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Users, DollarSign, FileText } from 'lucide-react-taro'
import { canViewStatistics } from '@/utils/permission'

export default function StatisticsPage() {
  const [loading, setLoading] = useState(false)
  const [stats, setStats] = useState<any>(null)

  useEffect(() => {
    if (!canViewStatistics()) {
      Taro.showToast({
        title: '无权访问',
        icon: 'none',
      })
      setTimeout(() => {
        Taro.navigateBack()
      }, 1500)
      return
    }

    loadStatistics()
  }, [])

  const loadStatistics = async () => {
    setLoading(true)
    try {
      // 模拟统计数据
      setStats({
        totalOrders: 20,
        pendingOrders: 5,
        lockedOrders: 5,
        inProgressOrders: 5,
        completedOrders: 5,
        totalAmount: 35000,
        thisMonthAmount: 12500,
        totalUsers: 15,
        activeUsers: 12,
      })
    } catch (error) {
      console.error('加载统计数据失败:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <View className="flex items-center justify-center min-h-screen bg-gray-50">
        <Text className="block text-gray-500">加载中...</Text>
      </View>
    )
  }

  if (!stats) return null

  return (
    <View className="min-h-screen bg-gray-50">
      {/* 顶部标题 */}
      <View className="bg-gradient-to-r from-blue-500 to-blue-600 px-4 py-6">
        <Text className="block text-xl font-bold text-white text-center">数据统计</Text>
      </View>

      <ScrollView scrollY className="flex-1 p-4 pb-8">
        {/* 订单统计 */}
        <Card className="mb-4">
          <CardHeader>
            <View className="flex items-center gap-2">
              <FileText size={18} color="#3b82f6" />
              <CardTitle className="text-base">订单统计</CardTitle>
            </View>
          </CardHeader>
          <CardContent>
            <View className="grid grid-cols-2 gap-3">
              <View className="bg-blue-50 p-3 rounded-xl">
                <Text className="block text-xs text-gray-600 mb-1">总订单数</Text>
                <Text className="block text-2xl font-bold text-blue-600">{stats.totalOrders}</Text>
              </View>
              <View className="bg-green-50 p-3 rounded-xl">
                <Text className="block text-xs text-gray-600 mb-1">已完成</Text>
                <Text className="block text-2xl font-bold text-green-600">{stats.completedOrders}</Text>
              </View>
              <View className="bg-yellow-50 p-3 rounded-xl">
                <Text className="block text-xs text-gray-600 mb-1">待执行</Text>
                <Text className="block text-2xl font-bold text-yellow-600">{stats.pendingOrders}</Text>
              </View>
              <View className="bg-orange-50 p-3 rounded-xl">
                <Text className="block text-xs text-gray-600 mb-1">执行中</Text>
                <Text className="block text-2xl font-bold text-orange-600">{stats.inProgressOrders}</Text>
              </View>
            </View>
          </CardContent>
        </Card>

        {/* 金额统计 */}
        <Card className="mb-4">
          <CardHeader>
            <View className="flex items-center gap-2">
              <DollarSign size={18} color="#3b82f6" />
              <CardTitle className="text-base">金额统计</CardTitle>
            </View>
          </CardHeader>
          <CardContent>
            <View className="space-y-3">
              <View className="flex justify-between items-center">
                <Text className="text-sm text-gray-600">总金额</Text>
                <Text className="text-lg font-bold text-gray-900">¥{stats.totalAmount.toLocaleString()}</Text>
              </View>
              <View className="flex justify-between items-center">
                <Text className="text-sm text-gray-600">本月金额</Text>
                <Text className="text-lg font-bold text-blue-600">¥{stats.thisMonthAmount.toLocaleString()}</Text>
              </View>
            </View>
          </CardContent>
        </Card>

        {/* 用户统计 */}
        <Card className="mb-4">
          <CardHeader>
            <View className="flex items-center gap-2">
              <Users size={18} color="#3b82f6" />
              <CardTitle className="text-base">用户统计</CardTitle>
            </View>
          </CardHeader>
          <CardContent>
            <View className="space-y-3">
              <View className="flex justify-between items-center">
                <Text className="text-sm text-gray-600">总用户数</Text>
                <Text className="text-lg font-bold text-gray-900">{stats.totalUsers}</Text>
              </View>
              <View className="flex justify-between items-center">
                <Text className="text-sm text-gray-600">活跃用户</Text>
                <Text className="text-lg font-bold text-green-600">{stats.activeUsers}</Text>
              </View>
            </View>
          </CardContent>
        </Card>
      </ScrollView>
    </View>
  )
}
