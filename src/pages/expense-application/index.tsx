import { useState, useEffect } from 'react'
import Taro from '@tarojs/taro'
import { View, Text, ScrollView } from '@tarojs/components'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Network } from '@/network'
import { ArrowLeft, Save } from 'lucide-react-taro'
import { canApplyExpense } from '@/utils/permission'

export default function ExpenseApplicationPage() {
  const [saving, setSaving] = useState(false)

  const [formData, setFormData] = useState({
    expenseType: '居间费',
    totalAmount: '',
    payee: '',
    expenseDetails: '',
    orderIds: [],
  })

  useEffect(() => {
    if (!canApplyExpense()) {
      Taro.showToast({
        title: '无权访问',
        icon: 'none',
      })
      setTimeout(() => {
        Taro.navigateBack()
      }, 1500)
      return
    }
  }, [])

  const handleSubmit = async () => {
    if (!formData.totalAmount || !formData.payee) {
      Taro.showToast({
        title: '请填写完整信息',
        icon: 'none',
      })
      return
    }

    setSaving(true)
    try {
      const res = await Network.request({
        url: '/api/expense-applications',
        method: 'POST',
        data: formData,
      })

      if (res.data.code === 200) {
        Taro.showToast({
          title: '申请提交成功',
          icon: 'success',
        })
        setTimeout(() => {
          Taro.navigateBack()
        }, 1500)
      }
    } catch (error) {
      console.error('提交失败:', error)
      Taro.showToast({
        title: '提交失败',
        icon: 'none',
      })
    } finally {
      setSaving(false)
    }
  }

  return (
    <View className="min-h-screen bg-gray-50">
      <View className="bg-gradient-to-r from-blue-500 to-blue-600 px-4 py-4">
        <View className="flex items-center gap-3">
          <Button size="sm" variant="ghost" onClick={() => Taro.navigateBack()} className="text-white border-white opacity-50">
            <ArrowLeft size={20} color="#ffffff" />
          </Button>
          <Text className="block text-xl font-bold text-white">费用申请</Text>
        </View>
      </View>

      <ScrollView scrollY className="flex-1 p-4 pb-32">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">申请信息</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <View>
              <Text className="block text-sm text-gray-700 mb-2">申请类型</Text>
              <View className="flex gap-2">
                {['居间费', '工费', '运费'].map((type) => (
                  <Button
                    key={type}
                    size="sm"
                    className={`flex-1 ${formData.expenseType === type ? 'bg-blue-500 text-white' : 'bg-gray-100 text-gray-700'}`}
                    onClick={() => setFormData({ ...formData, expenseType: type })}
                  >
                    <Text className="text-xs">{type}</Text>
                  </Button>
                ))}
              </View>
            </View>

            <View>
              <Text className="block text-sm text-gray-700 mb-2">申请金额</Text>
              <View className="bg-gray-50 rounded-xl px-4 py-3">
                <Input
                  className="w-full bg-transparent"
                  type="digit"
                  placeholder="请输入金额"
                  value={formData.totalAmount}
                  onInput={(e) => setFormData({ ...formData, totalAmount: e.detail.value })}
                />
              </View>
            </View>

            <View>
              <Text className="block text-sm text-gray-700 mb-2">收款人</Text>
              <View className="bg-gray-50 rounded-xl px-4 py-3">
                <Input
                  className="w-full bg-transparent"
                  placeholder="请输入收款人姓名"
                  value={formData.payee}
                  onInput={(e) => setFormData({ ...formData, payee: e.detail.value })}
                />
              </View>
            </View>

            <View>
              <Text className="block text-sm text-gray-700 mb-2">费用明细</Text>
              <View className="bg-gray-50 rounded-xl p-4">
                <Textarea
                  className="w-full bg-transparent"
                  placeholder="请输入费用明细"
                  value={formData.expenseDetails}
                  onInput={(e) => setFormData({ ...formData, expenseDetails: e.detail.value })}
                  maxlength={500}
                />
              </View>
            </View>
          </CardContent>
        </Card>
      </ScrollView>

      <View style={{ position: 'fixed', bottom: 0, left: 0, right: 0, padding: '16px', backgroundColor: '#ffffff', borderTop: '1px solid #e5e7eb', zIndex: 100 }}>
        <Button className="w-full bg-blue-500 text-white rounded-xl py-4" onClick={handleSubmit} disabled={saving}>
          <Save size={18} color="#ffffff" />
          <Text className="ml-2">{saving ? '提交中...' : '提交申请'}</Text>
        </Button>
      </View>
    </View>
  )
}
