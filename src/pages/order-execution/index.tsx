import { useState, useEffect } from 'react'
import Taro from '@tarojs/taro'
import { View, Text, ScrollView, Image } from '@tarojs/components'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { Network } from '@/network'
import {
  MapPin,
  Calendar,
  Circle,
  Camera,
  Users,
  Save,
  ArrowLeft,
} from 'lucide-react-taro'

export default function OrderExecutionPage() {
  const [loading, setLoading] = useState(false)
  const [saving, setSaving] = useState(false)
  const [order, setOrder] = useState<any>(null)

  // 表单数据
  const [formData, setFormData] = useState({
    executionDate: new Date().toISOString().split('T')[0],
    actualQuantity: '',
    testResult: '', // 合格/不合格
    executionPhotos: [] as string[],
    coWorkers: [] as string[],
    remarks: '',
  })

  // 共同施工人员输入
  const [coWorkerInput, setCoWorkerInput] = useState('')

  useEffect(() => {
    const { id } = Taro.getCurrentInstance().router?.params || {}
    if (id) {
      loadOrderDetail(id)
    }
  }, [])

  const loadOrderDetail = async (orderId: string) => {
    setLoading(true)
    try {
      const res = await Network.request({
        url: `/api/orders/${orderId}`,
        method: 'GET',
      })

      console.log('订单详情响应:', res)

      if (res.data.code === 200) {
        setOrder(res.data.data)
        // 预填数量
        setFormData((prev) => ({
          ...prev,
          actualQuantity: res.data.data.quantity?.toString() || '',
        }))
      }
    } catch (error) {
      console.error('获取订单详情失败:', error)
      Taro.showToast({
        title: '获取订单详情失败',
        icon: 'none',
      })
    } finally {
      setLoading(false)
    }
  }

  const handleChooseImage = () => {
    Taro.chooseImage({
      count: 9,
      sizeType: ['compressed'],
      sourceType: ['album', 'camera'],
      success: (res) => {
        const tempFilePaths = res.tempFilePaths
        setFormData((prev) => ({
          ...prev,
          executionPhotos: [...prev.executionPhotos, ...tempFilePaths],
        }))
      },
    })
  }

  const handleRemovePhoto = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      executionPhotos: prev.executionPhotos.filter((_, i) => i !== index),
    }))
  }

  const handleAddCoWorker = () => {
    if (coWorkerInput.trim()) {
      setFormData((prev) => ({
        ...prev,
        coWorkers: [...prev.coWorkers, coWorkerInput.trim()],
      }))
      setCoWorkerInput('')
    }
  }

  const handleRemoveCoWorker = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      coWorkers: prev.coWorkers.filter((_, i) => i !== index),
    }))
  }

  const handleSubmit = async () => {
    const { id } = Taro.getCurrentInstance().router?.params || {}

    if (!formData.actualQuantity) {
      Taro.showToast({
        title: '请填写实际数量',
        icon: 'none',
      })
      return
    }

    if (!formData.testResult) {
      Taro.showToast({
        title: '请选择检测结果',
        icon: 'none',
      })
      return
    }

    setSaving(true)
    try {
      const res = await Network.request({
        url: '/api/business-orders/execution',
        method: 'POST',
        data: {
          orderId: id,
          executionDate: formData.executionDate,
          actualQuantity: parseInt(formData.actualQuantity),
          testResult: formData.testResult,
          executionPhotos: formData.executionPhotos,
          coWorkers: formData.coWorkers,
          remarks: formData.remarks,
        },
      })

      console.log('保存执行结果响应:', res)

      if (res.data.code === 200) {
        Taro.showToast({
          title: '保存成功',
          icon: 'success',
        })
        setTimeout(() => {
          Taro.navigateBack()
        }, 1500)
      } else {
        Taro.showToast({
          title: res.data.msg || '保存失败',
          icon: 'none',
        })
      }
    } catch (error) {
      console.error('保存执行结果失败:', error)
      Taro.showToast({
        title: '保存失败',
        icon: 'none',
      })
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <View className="flex items-center justify-center min-h-screen bg-gray-50">
        <Text className="block text-gray-500">加载中...</Text>
      </View>
    )
  }

  return (
    <View className="min-h-screen bg-gray-50">
      {/* 顶部标题 */}
      <View className="bg-gradient-to-r from-blue-500 to-blue-600 px-4 py-4">
        <View className="flex items-center gap-3">
          <Button
            size="sm"
            variant="ghost"
            onClick={() => Taro.navigateBack()}
            className="text-white border-white opacity-50"
          >
            <ArrowLeft size={20} color="#ffffff" />
          </Button>
          <Text className="block text-xl font-bold text-white">订单执行</Text>
        </View>
      </View>

      <ScrollView scrollY className="flex-1 p-4 pb-32">
        {/* 订单信息 */}
        <Card className="mb-4">
          <CardHeader>
            <CardTitle className="text-base">订单信息</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <View>
              <Text className="block text-sm text-gray-500 mb-1">客户名称</Text>
              <Text className="block text-base font-medium">{order?.customer_name}</Text>
            </View>
            {order?.address && (
              <View>
                <Text className="block text-sm text-gray-500 mb-1">地址</Text>
                <View className="flex items-start gap-2">
                  <MapPin size={14} color="#6b7280" />
                  <Text className="block text-sm flex-1">{order.address}</Text>
                </View>
              </View>
            )}
            <View>
              <Text className="block text-sm text-gray-500 mb-1">数量</Text>
              <Text className="block text-base font-medium">{order?.quantity}</Text>
            </View>
          </CardContent>
        </Card>

        {/* 执行表单 */}
        <Card className="mb-4">
          <CardHeader>
            <CardTitle className="text-base">执行信息</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* 执行日期 */}
            <View>
              <View className="flex items-center gap-2 mb-2">
                <Calendar size={16} color="#6b7280" />
                <Text className="block text-sm text-gray-700">执行日期</Text>
              </View>
              <View className="bg-gray-50 rounded-xl px-4 py-3">
                <Input
                  className="w-full bg-transparent"
                  type="text"
                  value={formData.executionDate}
                  onInput={(e) =>
                    setFormData({ ...formData, executionDate: e.detail.value })
                  }
                />
              </View>
            </View>

            {/* 实际数量 */}
            <View>
              <Text className="block text-sm text-gray-700 mb-2">实际数量</Text>
              <View className="bg-gray-50 rounded-xl px-4 py-3">
                <Input
                  className="w-full bg-transparent"
                  type="number"
                  placeholder="请输入实际数量"
                  value={formData.actualQuantity}
                  onInput={(e) =>
                    setFormData({ ...formData, actualQuantity: e.detail.value })
                  }
                />
              </View>
            </View>

            {/* 检测结果 */}
            <View>
              <Text className="block text-sm text-gray-700 mb-2">检测结果</Text>
              <View className="flex gap-2">
                <Button
                  className={`flex-1 ${
                    formData.testResult === '合格'
                      ? 'bg-green-500 text-white'
                      : 'bg-gray-100 text-gray-700'
                  }`}
                  size="sm"
                  onClick={() => setFormData({ ...formData, testResult: '合格' })}
                >
                  <Circle size={14} color={formData.testResult === '合格' ? '#ffffff' : '#10b981'} />
                  <Text className="ml-1 text-xs">合格</Text>
                </Button>
                <Button
                  className={`flex-1 ${
                    formData.testResult === '不合格'
                      ? 'bg-red-500 text-white'
                      : 'bg-gray-100 text-gray-700'
                  }`}
                  size="sm"
                  onClick={() => setFormData({ ...formData, testResult: '不合格' })}
                >
                  <Circle size={14} color={formData.testResult === '不合格' ? '#ffffff' : '#ef4444'} />
                  <Text className="ml-1 text-xs">不合格</Text>
                </Button>
              </View>
            </View>

            {/* 施工照片 */}
            <View>
              <View className="flex items-center gap-2 mb-2">
                <Camera size={16} color="#6b7280" />
                <Text className="block text-sm text-gray-700">施工照片</Text>
                <Badge className="ml-auto text-xs">{formData.executionPhotos.length}/9</Badge>
              </View>
              <View className="grid grid-cols-3 gap-2">
                {formData.executionPhotos.map((photo, index) => (
                  <View key={index} className="relative">
                    <Image
                      src={photo}
                      className="w-full aspect-square rounded-lg"
                      mode="aspectFill"
                    />
                    <View
                      className="absolute top-1 right-1 w-5 h-5 bg-red-500 rounded-full flex items-center justify-center"
                      onClick={() => handleRemovePhoto(index)}
                    >
                      <Text className="text-white text-xs">×</Text>
                    </View>
                  </View>
                ))}
                {formData.executionPhotos.length < 9 && (
                  <View
                    className="w-full aspect-square rounded-lg border-2 border-dashed border-gray-300 flex items-center justify-center"
                    onClick={handleChooseImage}
                  >
                    <Camera size={24} color="#9ca3af" />
                  </View>
                )}
              </View>
            </View>

            {/* 共同施工人员 */}
            <View>
              <View className="flex items-center gap-2 mb-2">
                <Users size={16} color="#6b7280" />
                <Text className="block text-sm text-gray-700">共同施工人员</Text>
              </View>
              <View className="bg-gray-50 rounded-xl px-4 py-3 mb-2">
                <Input
                  className="w-full bg-transparent"
                  placeholder="输入姓名后添加"
                  value={coWorkerInput}
                  onInput={(e) => setCoWorkerInput(e.detail.value)}
                  onConfirm={handleAddCoWorker}
                />
              </View>
              <View className="flex flex-wrap gap-2">
                {formData.coWorkers.map((worker, index) => (
                  <View
                    key={index}
                    className="bg-blue-100 px-3 py-1 rounded-full flex items-center gap-2"
                  >
                    <Text className="text-sm text-blue-700">{worker}</Text>
                    <View
                      className="w-4 h-4 flex items-center justify-center"
                      onClick={() => handleRemoveCoWorker(index)}
                    >
                      <Text className="text-blue-700 text-xs">×</Text>
                    </View>
                  </View>
                ))}
              </View>
            </View>

            {/* 备注 */}
            <View>
              <Text className="block text-sm text-gray-700 mb-2">备注</Text>
              <View className="bg-gray-50 rounded-xl p-4">
                <Textarea
                  className="w-full bg-transparent"
                  placeholder="请输入备注信息"
                  value={formData.remarks}
                  onInput={(e) => setFormData({ ...formData, remarks: e.detail.value })}
                  maxlength={500}
                />
              </View>
            </View>
          </CardContent>
        </Card>
      </ScrollView>

      {/* 底部保存按钮 */}
      <View style={{ position: 'fixed', bottom: 0, left: 0, right: 0, padding: '16px', backgroundColor: '#ffffff', borderTop: '1px solid #e5e7eb', zIndex: 100 }}>
        <Button
          className="w-full bg-blue-500 text-white rounded-xl py-4"
          onClick={handleSubmit}
          disabled={saving}
        >
          <Save size={18} color="#ffffff" />
          <Text className="ml-2">{saving ? '保存中...' : '保存执行结果'}</Text>
        </Button>
      </View>
    </View>
  )
}
