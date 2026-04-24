import { useState, useEffect } from 'react'
import Taro from '@tarojs/taro'
import { View, Text, ScrollView } from '@tarojs/components'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Alert } from '@/components/ui/alert'
import { Network } from '@/network'
import { Check, X, UserCheck, ArrowLeft } from 'lucide-react-taro'
import { isSuperAdmin } from '@/utils/permission'

export default function UserApprovalPage() {
  const [loading, setLoading] = useState(false)
  const [pendingUsers, setPendingUsers] = useState<any[]>([])
  const [processingId, setProcessingId] = useState<string | null>(null)

  useEffect(() => {
    if (!isSuperAdmin()) {
      Taro.showToast({
        title: '无权访问',
        icon: 'none',
      })
      setTimeout(() => {
        Taro.navigateBack()
      }, 1500)
      return
    }

    loadPendingUsers()
  }, [])

  const loadPendingUsers = async () => {
    setLoading(true)
    try {
      const res = await Network.request({
        url: '/api/users/pending',
      })

      if (res.data.code === 200) {
        setPendingUsers(res.data.data || [])
      }
    } catch (error) {
      console.error('加载待审批用户失败:', error)
      Taro.showToast({
        title: '加载失败',
        icon: 'none',
      })
    } finally {
      setLoading(false)
    }
  }

  const handleApprove = async (userId: string, approved: boolean, remarks?: string) => {
    setProcessingId(userId)

    try {
      const userInfo = Taro.getStorageSync('userInfo')
      const res = await Network.request({
        url: `/api/users/${userId}/approve`,
        method: 'PUT',
        data: {
          approverId: userInfo?.id,
          approved,
          remarks,
        },
      })

      if (res.data.code === 200) {
        Taro.showToast({
          title: approved ? '已通过' : '已拒绝',
          icon: 'success',
        })
        await loadPendingUsers()
      } else {
        Taro.showToast({
          title: res.data.msg || '操作失败',
          icon: 'none',
        })
      }
    } catch (error) {
      console.error('审批失败:', error)
      Taro.showToast({
        title: '审批失败',
        icon: 'none',
      })
    } finally {
      setProcessingId(null)
    }
  }

  const getStatusBadge = (status: string) => {
    const statusMap: Record<string, { text: string; color: string }> = {
      pending: { text: '待审批', color: '#f59e0b' },
      approved: { text: '已通过', color: '#10b981' },
      rejected: { text: '已拒绝', color: '#ef4444' },
    }
    return statusMap[status] || { text: '未知', color: '#9ca3af' }
  }

  return (
    <View className="min-h-screen bg-gray-50">
      <View className="bg-gradient-to-r from-blue-500 to-blue-600 px-4 py-4">
        <View className="flex items-center gap-3">
          <Button size="sm" variant="ghost" onClick={() => Taro.navigateBack()} className="text-white border-white opacity-50">
            <ArrowLeft size={20} color="#ffffff" />
          </Button>
          <Text className="block text-xl font-bold text-white">用户审批</Text>
        </View>
      </View>

      <ScrollView scrollY className="flex-1 p-4 pb-8">
        <Alert className="mb-4">
          <UserCheck size={16} color="#3b82f6" />
          <View className="ml-2">
            <Text className="block font-semibold text-sm text-blue-800">超级管理员权限</Text>
            <Text className="block text-sm text-blue-700">只有超级管理员可以审批新用户注册</Text>
          </View>
        </Alert>

        {loading ? (
          <View className="py-8 text-center">
            <Text className="block text-gray-400">加载中...</Text>
          </View>
        ) : pendingUsers.length === 0 ? (
          <View className="py-8 text-center">
            <Check size={48} color="#d1d5db" />
            <Text className="block text-gray-400 mt-2">暂无待审批用户</Text>
          </View>
        ) : (
          <View className="space-y-3">
            {pendingUsers.map((user) => {
              const statusInfo = getStatusBadge(user.approval_status || 'pending')
              const isProcessing = processingId === user.id

              return (
                <Card key={user.id}>
                  <CardContent className="p-4">
                    <View className="flex items-start justify-between mb-3">
                      <View className="flex items-center gap-3">
                        <View className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                          <Text className="text-lg font-bold text-blue-600">
                            {user.name.charAt(0)}
                          </Text>
                        </View>
                        <View>
                          <Text className="block font-semibold text-gray-900">{user.name}</Text>
                          <Text className="block text-sm text-gray-500">{user.phone || '未填写手机号'}</Text>
                        </View>
                      </View>
                      <Badge
                        className="text-xs px-2 py-1"
                        style={{ backgroundColor: `${statusInfo.color}20`, color: statusInfo.color }}
                      >
                        {statusInfo.text}
                      </Badge>
                    </View>

                    <View className="mb-3">
                      <Text className="block text-xs text-gray-500">公司: {user.company === 'sanheng_jiliang' ? '叁恒计量' : '叁恒智安'}</Text>
                      <Text className="block text-xs text-gray-500">注册时间: {new Date(user.created_at).toLocaleDateString()}</Text>
                    </View>

                    <View className="flex gap-2">
                      <Button
                        size="sm"
                        className="flex-1 bg-green-500 text-white"
                        onClick={() => handleApprove(user.id, true, '审批通过')}
                        disabled={isProcessing}
                      >
                        <Check size={16} color="#ffffff" />
                        <Text className="ml-1">{isProcessing ? '处理中...' : '通过'}</Text>
                      </Button>
                      <Button
                        size="sm"
                        className="flex-1 bg-red-500 text-white"
                        onClick={() => handleApprove(user.id, false, '审批拒绝')}
                        disabled={isProcessing}
                      >
                        <X size={16} color="#ffffff" />
                        <Text className="ml-1">{isProcessing ? '处理中...' : '拒绝'}</Text>
                      </Button>
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
