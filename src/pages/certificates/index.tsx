import { useState, useEffect } from 'react'
import Taro from '@tarojs/taro'
import { View, Text, ScrollView } from '@tarojs/components'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { FileText, Package, Truck, Check, Clock } from 'lucide-react-taro'
import { canManageCertificates } from '@/utils/permission'

export default function CertificatesPage() {
  const [loading, setLoading] = useState(false)
  const [certificates, setCertificates] = useState<any[]>([])

  useEffect(() => {
    if (!canManageCertificates()) {
      Taro.showToast({
        title: '无权访问',
        icon: 'none',
      })
      setTimeout(() => {
        Taro.navigateBack()
      }, 1500)
      return
    }

    loadCertificates()
  }, [])

  const loadCertificates = async () => {
    setLoading(true)
    try {
      // 模拟数据
      setCertificates([
        { id: '1', customerName: '陕西能源集团', certificateNo: 'CERT202401001', status: 'preparing', createdAt: '2024-01-17' },
        { id: '2', customerName: '西安热电厂', certificateNo: 'CERT202401002', status: 'shipped', trackingNumber: 'SF1234567890', createdAt: '2024-01-16' },
        { id: '3', customerName: '延长石油', certificateNo: 'CERT202401003', status: 'delivered', createdAt: '2024-01-15' },
      ])
    } catch (error) {
      console.error('加载证书列表失败:', error)
    } finally {
      setLoading(false)
    }
  }

  const getStatusBadge = (status: string) => {
    const statusMap: Record<string, { text: string; color: string; icon: any }> = {
      preparing: { text: '编制中', color: '#f59e0b', icon: FileText },
      shipped: { text: '已寄送', color: '#3b82f6', icon: Truck },
      delivered: { text: '已送达', color: '#10b981', icon: Check },
    }
    return statusMap[status] || { text: '未知', color: '#9ca3af', icon: Clock }
  }

  return (
    <View className="min-h-screen bg-gray-50">
      <View className="bg-gradient-to-r from-blue-500 to-blue-600 px-4 py-6">
        <Text className="block text-xl font-bold text-white text-center">证书管理</Text>
      </View>

      <ScrollView scrollY className="flex-1 p-4 pb-8">
        {loading ? (
          <View className="py-8 text-center">
            <Text className="block text-gray-400">加载中...</Text>
          </View>
        ) : certificates.length === 0 ? (
          <View className="py-8 text-center">
            <Package size={48} color="#d1d5db" />
            <Text className="block text-gray-400 mt-2">暂无证书</Text>
          </View>
        ) : (
          <View className="space-y-3">
            {certificates.map((cert) => {
              const statusInfo = getStatusBadge(cert.status)
              const StatusIcon = statusInfo.icon
              return (
                <Card key={cert.id}>
                  <CardContent className="p-4">
                    <View className="flex items-start justify-between mb-3">
                      <View className="flex-1">
                        <Text className="block font-semibold text-gray-900 mb-1">{cert.customerName}</Text>
                        <Text className="block text-sm text-gray-500">证书编号: {cert.certificateNo}</Text>
                      </View>
                      <View className="flex items-center gap-2">
                        <StatusIcon size={16} color={statusInfo.color} />
                        <Badge
                          className="text-xs px-2 py-1"
                          style={{ backgroundColor: `${statusInfo.color}20`, color: statusInfo.color }}
                        >
                          {statusInfo.text}
                        </Badge>
                      </View>
                    </View>

                    {cert.trackingNumber && (
                      <View>
                        <Text className="block text-xs text-gray-500 mb-1">运单号</Text>
                        <Text className="block text-sm text-gray-900">{cert.trackingNumber}</Text>
                      </View>
                    )}

                    <View className="mt-2">
                      <Text className="block text-xs text-gray-500">创建时间: {cert.createdAt}</Text>
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
