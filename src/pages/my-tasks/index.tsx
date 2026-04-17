import { useState, useEffect } from 'react'
import Taro from '@tarojs/taro'
import { View, Text } from '@tarojs/components'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Network } from '@/network'
import { Play, CircleCheck, Clock, MapPin } from 'lucide-react-taro'
import { getCurrentUser, isInstaller, isTester } from '@/utils/permission'

export default function MyTasksPage() {
  const [tasks, setTasks] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const [activeTab, setActiveTab] = useState<'pending' | 'in_progress' | 'completed'>('pending')

  const currentUser = getCurrentUser()
  const taskType = isInstaller() ? '安装' : isTester() ? '检测' : '任务'

  useEffect(() => {
    // 检查权限
    if (!isInstaller() && !isTester()) {
      Taro.showToast({
        title: '无权访问',
        icon: 'none',
      })
      setTimeout(() => {
        Taro.navigateBack()
      }, 1500)
      return
    }

    loadTasks()
  }, [activeTab])

  const loadTasks = async () => {
    setLoading(true)
    try {
      const res = await Network.request({
        url: '/api/tasks/my-tasks',
        method: 'GET',
        data: {
          status: activeTab,
          executorId: currentUser?.id,
        },
      })

      console.log('任务列表响应:', res)

      if (res.data.code === 200) {
        setTasks(res.data.data || [])
      }
    } catch (error) {
      console.error('获取任务列表失败:', error)
      // 模拟数据（开发阶段）
      setTasks([])
    } finally {
      setLoading(false)
    }
  }

  const handleAcceptTask = (_taskId: string) => {
    Taro.showModal({
      title: '确认接单',
      content: '确定要接取此任务吗？',
      success: (res) => {
        if (res.confirm) {
          Taro.showToast({
            title: '接单成功',
            icon: 'success',
          })
          loadTasks()
        }
      },
    })
  }

  const handleStartTask = (taskId: string) => {
    Taro.navigateTo({
      url: `/pages/task-detail/index?id=${taskId}`,
    })
  }

  const handleCompleteTask = (taskId: string) => {
    Taro.navigateTo({
      url: `/pages/task-detail/index?id=${taskId}&mode=complete`,
    })
  }

  const getTaskStatusBadge = (status: string) => {
    const statusMap: Record<string, { text: string; color: string }> = {
      pending: { text: '待执行', color: '#faad14' },
      in_progress: { text: '进行中', color: '#1890ff' },
      completed: { text: '已完成', color: '#52c41a' },
    }
    const statusInfo = statusMap[status] || { text: '未知', color: '#8c8c8c' }
    return statusInfo
  }

  return (
    <View className="min-h-screen bg-gray-50">
      {/* 顶部标签页 */}
      <View className="bg-white border-b border-gray-200">
        <View className="flex">
          <View
            className={`flex-1 py-3 text-center ${
              activeTab === 'pending' ? 'border-b-2 border-blue-500 text-blue-500' : 'text-gray-500'
            }`}
            onClick={() => setActiveTab('pending')}
          >
            <Text className="text-sm font-medium">待执行</Text>
          </View>
          <View
            className={`flex-1 py-3 text-center ${
              activeTab === 'in_progress' ? 'border-b-2 border-blue-500 text-blue-500' : 'text-gray-500'
            }`}
            onClick={() => setActiveTab('in_progress')}
          >
            <Text className="text-sm font-medium">进行中</Text>
          </View>
          <View
            className={`flex-1 py-3 text-center ${
              activeTab === 'completed' ? 'border-b-2 border-blue-500 text-blue-500' : 'text-gray-500'
            }`}
            onClick={() => setActiveTab('completed')}
          >
            <Text className="text-sm font-medium">已完成</Text>
          </View>
        </View>
      </View>

      {/* 任务列表 */}
      <View className="p-4 pb-8">
        {loading ? (
          <View className="py-8 text-center">
            <Text className="block text-gray-400">加载中...</Text>
          </View>
        ) : tasks.length === 0 ? (
          <View className="py-8 text-center">
            <Clock size={48} color="#d1d5db" />
            <Text className="block text-gray-400 mt-2">暂无任务</Text>
          </View>
        ) : (
          <View className="space-y-3">
            {tasks.map((task) => {
              const statusInfo = getTaskStatusBadge(task.status)
              return (
                <Card key={task.id}>
                  <CardContent className="p-4">
                    <View className="flex items-start justify-between mb-3">
                      <View className="flex-1">
                        <Text className="block font-semibold text-gray-900 mb-1">
                          {task.order?.customer_name || '未知客户'}
                        </Text>
                        <View className="flex items-center gap-2">
                          <Badge
                            className="text-xs px-2 py-1"
                            style={{ backgroundColor: `${statusInfo.color}20`, color: statusInfo.color }}
                          >
                            {statusInfo.text}
                          </Badge>
                          <Text className="text-xs text-gray-500">
                            {taskType}任务
                          </Text>
                        </View>
                      </View>
                    </View>

                    <View className="mb-3">
                      {task.order?.address && (
                        <View className="flex items-center gap-1 mb-1">
                          <MapPin size={14} color="#6b7280" />
                          <Text className="text-sm text-gray-600 flex-1">
                            {task.order.address}
                          </Text>
                        </View>
                      )}
                    </View>

                    {task.status === 'pending' && (
                      <Button
                        className="w-full bg-blue-500 text-white"
                        size="sm"
                        onClick={() => handleAcceptTask(task.id)}
                      >
                        <Play size={16} color="#ffffff" />
                        <Text className="ml-2">接单</Text>
                      </Button>
                    )}

                    {task.status === 'in_progress' && (
                      <Button
                        className="w-full bg-green-500 text-white"
                        size="sm"
                        onClick={() => handleCompleteTask(task.id)}
                      >
                        <CircleCheck size={16} color="#ffffff" />
                        <Text className="ml-2">完成任务</Text>
                      </Button>
                    )}

                    {task.status === 'completed' && (
                      <Button
                        className="w-full"
                        variant="outline"
                        size="sm"
                        onClick={() => handleStartTask(task.id)}
                      >
                        <Text className="text-sm">查看详情</Text>
                      </Button>
                    )}
                  </CardContent>
                </Card>
              )
            })}
          </View>
        )}
      </View>
    </View>
  )
}
