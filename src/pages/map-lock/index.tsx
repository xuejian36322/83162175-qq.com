import { useState, useEffect } from 'react'
import Taro from '@tarojs/taro'
import { View, Text, ScrollView } from '@tarojs/components'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Network } from '@/network'
import { MapPin, Lock, Clock, RefreshCw } from 'lucide-react-taro'
import { isExecutor, getCurrentUser } from '@/utils/permission'

interface Order {
  id: string
  customer_name: string
  address: string
  quantity: number
  lock_status: 'unlocked' | 'locked' | 'expired'
  locked_by?: string
  locked_at?: string
  executor_name?: string
}

export default function MapLockPage() {
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(false)
  const [refreshing, setRefreshing] = useState(false)
  const currentUser = getCurrentUser()

  useEffect(() => {
    // 检查权限
    if (!isExecutor()) {
      Taro.showToast({
        title: '无权访问',
        icon: 'none',
      })
      setTimeout(() => {
        Taro.navigateBack()
      }, 1500)
      return
    }

    loadOrders()
  }, [])

  const loadOrders = async () => {
    setLoading(true)
    try {
      const res = await Network.request({
        url: '/api/business-orders/map-orders',
        method: 'GET',
      })

      console.log('地图订单响应:', res)

      if (res.data.code === 200) {
        setOrders(res.data.data || [])
      }
    } catch (error) {
      console.error('获取订单列表失败:', error)
      Taro.showToast({
        title: '获取订单失败',
        icon: 'none',
      })
    } finally {
      setLoading(false)
      setRefreshing(false)
    }
  }

  const handleRefresh = () => {
    setRefreshing(true)
    loadOrders()
  }

  const handleLockOrder = async (orderId: string) => {
    Taro.showModal({
      title: '确认锁定',
      content: '确定要锁定此订单吗？锁定后24小时内必须完成。',
      success: async (res) => {
        if (res.confirm) {
          try {
            const lockRes = await Network.request({
              url: '/api/business-orders/lock',
              method: 'POST',
              data: { orderId },
            })

            console.log('锁定订单响应:', lockRes)

            if (lockRes.data.code === 200) {
              Taro.showToast({
                title: '锁定成功',
                icon: 'success',
              })
              loadOrders()
            } else {
              Taro.showToast({
                title: lockRes.data.msg || '锁定失败',
                icon: 'none',
              })
            }
          } catch (error) {
            console.error('锁定订单失败:', error)
            Taro.showToast({
              title: '锁定失败',
              icon: 'none',
            })
          }
        }
      },
    })
  }

  const handleUnlockOrder = async (orderId: string) => {
    Taro.showModal({
      title: '确认解锁',
      content: '确定要解锁此订单吗？',
      success: async (res) => {
        if (res.confirm) {
          try {
            const unlockRes = await Network.request({
              url: '/api/business-orders/unlock',
              method: 'POST',
              data: { orderId },
            })

            console.log('解锁订单响应:', unlockRes)

            if (unlockRes.data.code === 200) {
              Taro.showToast({
                title: '解锁成功',
                icon: 'success',
              })
              loadOrders()
            } else {
              Taro.showToast({
                title: unlockRes.data.msg || '解锁失败',
                icon: 'none',
              })
            }
          } catch (error) {
            console.error('解锁订单失败:', error)
            Taro.showToast({
              title: '解锁失败',
              icon: 'none',
            })
          }
        }
      },
    })
  }

  const handleStartExecution = (orderId: string) => {
    Taro.navigateTo({
      url: `/pages/order-execution/index?id=${orderId}`,
    })
  }

  const getLockStatusBadge = (status: string) => {
    const statusMap: Record<string, { text: string; color: string }> = {
      unlocked: { text: '未锁定', color: '#52c41a' },
      locked: { text: '已锁定', color: '#1890ff' },
      expired: { text: '已过期', color: '#f5222d' },
    }
    return statusMap[status] || { text: '未知', color: '#8c8c8c' }
  }

  return (
    <View className="min-h-screen bg-gray-50">
      {/* 顶部标题 */}
      <View className="bg-gradient-to-r from-blue-500 to-blue-600 px-4 py-6">
        <View className="flex items-center justify-between">
          <View className="flex items-center gap-3">
            <MapPin size={24} color="#ffffff" />
            <Text className="block text-xl font-bold text-white">地图标点</Text>
          </View>
          <Button
            size="sm"
            variant="ghost"
            onClick={handleRefresh}
            disabled={refreshing}
            className="text-white border-white opacity-50"
          >
            <RefreshCw size={18} color="#ffffff" className={refreshing ? 'animate-spin' : ''} />
          </Button>
        </View>
        <Text className="block text-blue-100 text-sm mt-2">
          先到先得，锁定后24小时内必须完成
        </Text>
      </View>

      {/* 订单列表 */}
      <ScrollView scrollY className="flex-1 p-4 pb-8">
        {loading ? (
          <View className="py-8 text-center">
            <Text className="block text-gray-400">加载中...</Text>
          </View>
        ) : orders.length === 0 ? (
          <View className="py-8 text-center">
            <Clock size={48} color="#d1d5db" />
            <Text className="block text-gray-400 mt-2">暂无未施工订单</Text>
          </View>
        ) : (
          <View className="space-y-3">
            {orders.map((order) => {
              const statusInfo = getLockStatusBadge(order.lock_status)
              const isMyOrder = order.locked_by === currentUser?.id
              const canLock = order.lock_status === 'unlocked'

              return (
                <Card key={order.id}>
                  <CardContent className="p-4">
                    <View className="flex items-start justify-between mb-3">
                      <View className="flex-1">
                        <Text className="block font-semibold text-gray-900 mb-1">
                          {order.customer_name}
                        </Text>
                        <View className="flex items-center gap-2 mb-2">
                          <Badge
                            className="text-xs px-2 py-1"
                            style={{ backgroundColor: `${statusInfo.color}20`, color: statusInfo.color }}
                          >
                            {statusInfo.text}
                          </Badge>
                          <Text className="text-xs text-gray-500">
                            数量: {order.quantity}
                          </Text>
                        </View>
                        {order.locked_by && (
                          <Text className="text-xs text-gray-500">
                            锁定人: {order.executor_name || '未知'}
                          </Text>
                        )}
                      </View>
                      <Lock size={20} color={statusInfo.color} />
                    </View>

                    <View className="mb-3">
                      <View className="flex items-start gap-1">
                        <MapPin size={14} color="#6b7280" />
                        <Text className="text-sm text-gray-600 flex-1">
                          {order.address}
                        </Text>
                      </View>
                    </View>

                    {/* 操作按钮 */}
                    <View className="flex gap-2">
                      {canLock && (
                        <Button
                          className="flex-1 bg-blue-500 text-white"
                          size="sm"
                          onClick={() => handleLockOrder(order.id)}
                        >
                          <Lock size={14} color="#ffffff" />
                          <Text className="ml-2 text-xs">锁定订单</Text>
                        </Button>
                      )}

                      {isMyOrder && order.lock_status === 'locked' && (
                        <>
                          <Button
                            className="flex-1 bg-green-500 text-white"
                            size="sm"
                            onClick={() => handleStartExecution(order.id)}
                          >
                            <Text className="text-xs">开始执行</Text>
                          </Button>
                          <Button
                            className="flex-1"
                            variant="outline"
                            size="sm"
                            onClick={() => handleUnlockOrder(order.id)}
                          >
                            <Text className="text-xs">解锁</Text>
                          </Button>
                        </>
                      )}

                      {order.lock_status === 'locked' && !isMyOrder && (
                        <View className="flex-1 bg-gray-100 rounded-lg py-2 text-center">
                          <Text className="text-xs text-gray-500">已被锁定</Text>
                        </View>
                      )}
                    </View>
                  </CardContent>
                </Card>
              )
            })}
          </View>
        )}
      </ScrollView>
    </View>
  )
}
