import { View, Text } from '@tarojs/components'
import Taro from '@tarojs/taro'
import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Network } from '@/network'
import { MapPin, Save, X, Plus, Minus, User, Building2, FileText, Calculator, Search, Check } from 'lucide-react-taro'

// 业务类型配置（从数据库获取的默认值）
const DEFAULT_BUSINESS_TYPES = [
  // 计量检测类
  { id: '1', name: '压力表检测', category: '计量', icon: 'Gauge', popular: true, defaultPrice: 100 },
  { id: '2', name: '安全阀检测', category: '计量', icon: 'ShieldAlert', popular: true, defaultPrice: 150 },
  { id: '3', name: '温度计检测', category: '计量', icon: 'Thermometer', popular: false, defaultPrice: 80 },
  { id: '4', name: '流量计检测', category: '计量', icon: 'Activity', popular: false, defaultPrice: 200 },
  { id: '5', name: '燃气表检测', category: '计量', icon: 'Flame', popular: true, defaultPrice: 120 },
  // 工程安装类
  { id: '6', name: '燃气管道安装', category: '工程', icon: 'Wrench', popular: true, defaultPrice: 500 },
  { id: '7', name: '燃气报警器安装', category: '工程', icon: 'AlertTriangle', popular: true, defaultPrice: 300 },
  { id: '8', name: '燃气阀门安装', category: '工程', icon: 'Circle', popular: false, defaultPrice: 150 },
  { id: '9', name: '燃气管道维修', category: '工程', icon: 'Hammer', popular: false, defaultPrice: 200 },
]

// 已选业务类型项
interface SelectedBusinessType {
  businessTypeId: string
  businessTypeName: string
  quantity: number
  unitPrice: number
  contractAmount: number
}

export default function OrderCreatePage() {
  const [loading, setLoading] = useState(false)
  const [userInfo, setUserInfo] = useState<any>(null)

  // 表单数据
  const [formData, setFormData] = useState({
    orderDate: new Date().toISOString().split('T')[0],
    customerName: '',
    invoiceCompanyName: '',
    reportName: '',
    companyName: 'sanheng_jiliang',
    contractAmount: 0,
    actualAmount: '',
    commissionStandard: '',
    commissionFee: '',
    thirdPartyCollection: '',
    transportFee: '',
    taxFee: '',
    deposit: '',
    laborFee: '',
    laborFeeRemaining: '',
    sourceUserId: '',
    executor1Id: '',
    executor2Id: '',
    executionDate: '',
    commissionDate: '',
    paymentDate: '',
    paymentMethod: '开票收款',
    status: 'pending',
    reportType: '',
    testResult: '',
    contactPerson: '',
    contactPhone: '',
    address: '',
    locationLatitude: '',
    locationLongitude: '',
    trackingNumber: '',
    remarks: '',
  })

  // 多业务类型支持
  const [selectedBusinessTypes, setSelectedBusinessTypes] = useState<SelectedBusinessType[]>([])
  const [showBusinessTypePicker, setShowBusinessTypePicker] = useState(false)
  const [searchKeyword, setSearchKeyword] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<string>('全部')

  useEffect(() => {
    const user = Taro.getStorageSync('userInfo')
    if (!user) {
      Taro.redirectTo({ url: '/pages/login/index' })
      return
    }
    setUserInfo(user)
  }, [])

  // 自动计算总金额
  useEffect(() => {
    const totalAmount = selectedBusinessTypes.reduce((sum, item) => sum + item.contractAmount, 0)
    setFormData((prev) => ({ ...prev, contractAmount: totalAmount }))

    // 自动计算居间费
    const commissionStandard = parseFloat(formData.commissionStandard.toString()) || 0
    const commissionFee = (totalAmount * commissionStandard / 100).toFixed(2)
    setFormData((prev) => ({ ...prev, commissionFee }))
  }, [selectedBusinessTypes, formData.commissionStandard])

  // 过滤业务类型
  const filteredBusinessTypes = DEFAULT_BUSINESS_TYPES.filter((type) => {
    const matchCategory = selectedCategory === '全部' || type.category === selectedCategory
    const matchSearch = type.name.toLowerCase().includes(searchKeyword.toLowerCase())
    return matchCategory && matchSearch
  })

  // 分类列表
  const categories = ['全部', '计量', '工程']

  // 选择业务类型
  const handleSelectBusinessType = (type: any) => {
    const exists = selectedBusinessTypes.find(item => item.businessTypeId === type.id)
    if (exists) return

    const newItem: SelectedBusinessType = {
      businessTypeId: type.id,
      businessTypeName: type.name,
      quantity: 1,
      unitPrice: type.defaultPrice,
      contractAmount: type.defaultPrice,
    }

    setSelectedBusinessTypes([...selectedBusinessTypes, newItem])
  }

  // 移除已选业务类型
  const handleRemoveBusinessType = (businessTypeId: string) => {
    setSelectedBusinessTypes(selectedBusinessTypes.filter(item => item.businessTypeId !== businessTypeId))
  }

  // 更新已选业务类型
  const handleUpdateBusinessTypeItem = (businessTypeId: string, field: keyof SelectedBusinessType, value: any) => {
    setSelectedBusinessTypes(selectedBusinessTypes.map(item => {
      if (item.businessTypeId === businessTypeId) {
        const updated = { ...item, [field]: value }
        // 自动计算金额
        if (field === 'quantity' || field === 'unitPrice') {
          updated.contractAmount = updated.quantity * updated.unitPrice
        }
        return updated
      }
      return item
    }))
  }

  // 获取当前位置
  const handleChooseLocation = () => {
    Taro.chooseLocation({
      success: (res) => {
        setFormData((prev) => ({
          ...prev,
          address: res.address || res.name,
          locationLatitude: res.latitude.toString(),
          locationLongitude: res.longitude.toString(),
        }))
      },
      fail: (err) => {
        console.error('选择位置失败:', err)
        Taro.showToast({
          title: '选择位置失败',
          icon: 'none',
        })
      }
    })
  }

  // 提交订单
  const handleSubmit = async () => {
    if (!formData.customerName) {
      Taro.showToast({ title: '请填写客户名称', icon: 'none' })
      return
    }

    if (selectedBusinessTypes.length === 0) {
      Taro.showToast({ title: '请选择业务类型', icon: 'none' })
      return
    }

    setLoading(true)

    try {
      const submitData = {
        ...formData,
        businessTypes: selectedBusinessTypes,
        managerId: userInfo.id,
      }

      const res = await Network.request({
        url: '/api/orders',
        method: 'POST',
        data: submitData,
      })

      console.log('创建订单响应:', res)

      if (res.data.code === 200) {
        Taro.showToast({
          title: '创建成功',
          icon: 'success',
        })

        setTimeout(() => {
          Taro.navigateBack()
        }, 1500)
      } else {
        Taro.showToast({
          title: res.data.msg || '创建失败',
          icon: 'none',
        })
      }
    } catch (error) {
      console.error('创建订单失败:', error)
      Taro.showToast({
        title: '创建失败',
        icon: 'none',
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <View className="min-h-screen bg-gray-50 pb-24">
      {/* 顶部进度提示 */}
      <View className="bg-gradient-to-r from-blue-500 to-blue-600 px-4 py-3 mb-4">
        <View className="flex items-center justify-between">
          <View className="flex items-center gap-2">
            <Building2 size={18} color="#ffffff" />
            <Text className="text-white font-medium">创建订单</Text>
          </View>
          <View className="flex items-center gap-1">
            <View className="w-2 h-2 rounded-full bg-white" />
            <View className="w-2 h-2 rounded-full bg-white opacity-30" />
            <View className="w-2 h-2 rounded-full bg-white opacity-30" />
          </View>
        </View>
      </View>

      {/* 基本信息 */}
      <Card className="mx-4 mb-4">
        <CardHeader className="pb-3">
          <View className="flex items-center justify-between">
            <View className="flex items-center gap-2">
              <User size={18} color="#1890ff" />
              <CardTitle className="text-base">基本信息</CardTitle>
            </View>
            <Badge variant="outline" className="text-xs">必填</Badge>
          </View>
        </CardHeader>
        <CardContent className="space-y-3">
          <View>
            <Text className="block text-sm text-gray-600 mb-2">客户名称 *</Text>
            <View className="bg-gray-50 rounded-xl px-4 py-3">
              <Input
                className="w-full bg-transparent"
                placeholder="请输入客户名称"
                value={formData.customerName}
                onInput={(e) => setFormData({ ...formData, customerName: e.detail.value })}
              />
            </View>
          </View>

          <View>
            <Text className="block text-sm text-gray-600 mb-2">开票单位名称</Text>
            <View className="bg-gray-50 rounded-xl px-4 py-3">
              <Input
                className="w-full bg-transparent"
                placeholder="请输入开票单位名称"
                value={formData.invoiceCompanyName}
                onInput={(e) => setFormData({ ...formData, invoiceCompanyName: e.detail.value })}
              />
            </View>
          </View>

          <View>
            <Text className="block text-sm text-gray-600 mb-2">联系人</Text>
            <View className="bg-gray-50 rounded-xl px-4 py-3">
              <Input
                className="w-full bg-transparent"
                placeholder="请输入联系人姓名"
                value={formData.contactPerson}
                onInput={(e) => setFormData({ ...formData, contactPerson: e.detail.value })}
              />
            </View>
          </View>

          <View>
            <Text className="block text-sm text-gray-600 mb-2">联系电话</Text>
            <View className="bg-gray-50 rounded-xl px-4 py-3">
              <Input
                className="w-full bg-transparent"
                type="number"
                placeholder="请输入联系电话"
                value={formData.contactPhone}
                onInput={(e) => setFormData({ ...formData, contactPhone: e.detail.value })}
              />
            </View>
          </View>

          <View>
            <Text className="block text-sm text-gray-600 mb-2">地址</Text>
            <View className="flex gap-2">
              <View className="flex-1 bg-gray-50 rounded-xl px-4 py-3">
                <Input
                  className="w-full bg-transparent"
                  placeholder="请选择地址"
                  value={formData.address}
                  onInput={(e) => setFormData({ ...formData, address: e.detail.value })}
                />
              </View>
              <Button
                size="sm"
                className="flex-shrink-0 bg-blue-500 text-white"
                onClick={handleChooseLocation}
              >
                <MapPin size={16} color="#ffffff" />
              </Button>
            </View>
          </View>
        </CardContent>
      </Card>

      {/* 业务类型选择 */}
      <Card className="mx-4 mb-4">
        <CardHeader className="pb-3">
          <View className="flex items-center justify-between">
            <View className="flex items-center gap-2">
              <FileText size={18} color="#1890ff" />
              <CardTitle className="text-base">业务类型</CardTitle>
            </View>
            <Button
              size="sm"
              variant="outline"
              onClick={() => setShowBusinessTypePicker(true)}
            >
              <Text className="text-sm">添加业务类型</Text>
              <Plus size={16} color="#1890ff" />
            </Button>
          </View>
        </CardHeader>
        <CardContent>
          {selectedBusinessTypes.length === 0 ? (
            <View className="py-8 text-center">
              <Text className="block text-gray-400 text-sm">暂未选择业务类型</Text>
              <Text className="block text-gray-400 text-xs mt-1">点击上方按钮添加</Text>
            </View>
          ) : (
            <View className="space-y-3">
              {selectedBusinessTypes.map((item) => (
                <View key={item.businessTypeId} className="bg-gray-50 rounded-xl p-4">
                  <View className="flex items-center justify-between mb-3">
                    <Text className="font-medium text-gray-900">{item.businessTypeName}</Text>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => handleRemoveBusinessType(item.businessTypeId)}
                    >
                      <X size={16} color="#ef4444" />
                    </Button>
                  </View>

                  {/* 数量 */}
                  <View className="flex items-center justify-between mb-2">
                    <Text className="text-sm text-gray-600">数量</Text>
                    <View className="flex items-center gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleUpdateBusinessTypeItem(item.businessTypeId, 'quantity', Math.max(1, item.quantity - 1))}
                      >
                        <Minus size={14} color="#6b7280" />
                      </Button>
                      <Text className="w-12 text-center font-medium">{item.quantity}</Text>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleUpdateBusinessTypeItem(item.businessTypeId, 'quantity', item.quantity + 1)}
                      >
                        <Plus size={14} color="#6b7280" />
                      </Button>
                    </View>
                  </View>

                  {/* 单价 */}
                  <View className="flex items-center justify-between">
                    <Text className="text-sm text-gray-600">单价（元）</Text>
                    <View className="bg-white rounded-lg px-3 py-2 w-24">
                      <Input
                        className="text-right bg-transparent"
                        type="digit"
                        value={item.unitPrice.toString()}
                        onInput={(e) => handleUpdateBusinessTypeItem(item.businessTypeId, 'unitPrice', parseFloat(e.detail.value) || 0)}
                      />
                    </View>
                  </View>

                  {/* 小计 */}
                  <View className="flex items-center justify-between mt-2 pt-2 border-t border-gray-200">
                    <Text className="text-sm text-gray-600">小计</Text>
                    <Text className="font-semibold text-blue-600">¥{item.contractAmount.toFixed(2)}</Text>
                  </View>
                </View>
              ))}
            </View>
          )}
        </CardContent>
      </Card>

      {/* 费用明细 */}
      <Card className="mx-4 mb-4">
        <CardHeader className="pb-3">
          <View className="flex items-center gap-2">
            <Calculator size={18} color="#1890ff" />
            <CardTitle className="text-base">费用明细</CardTitle>
          </View>
        </CardHeader>
        <CardContent className="space-y-3">
          <View className="flex items-center justify-between">
            <Text className="text-sm text-gray-600">合同金额</Text>
            <Text className="font-bold text-lg text-blue-600">¥{formData.contractAmount.toFixed(2)}</Text>
          </View>

          <View>
            <Text className="block text-sm text-gray-600 mb-2">居间标准（%）</Text>
            <View className="bg-gray-50 rounded-xl px-4 py-3">
              <Input
                className="w-full bg-transparent"
                type="digit"
                placeholder="请输入居间标准"
                value={formData.commissionStandard}
                onInput={(e) => setFormData({ ...formData, commissionStandard: e.detail.value })}
              />
            </View>
          </View>

          <View className="flex items-center justify-between bg-blue-50 rounded-lg p-3">
            <Text className="text-sm text-gray-700">居间费</Text>
            <Text className="font-bold text-blue-600">¥{formData.commissionFee || '0.00'}</Text>
          </View>
        </CardContent>
      </Card>

      {/* 备注 */}
      <Card className="mx-4 mb-4">
        <CardHeader className="pb-3">
          <CardTitle className="text-base">备注</CardTitle>
        </CardHeader>
        <CardContent>
          <View className="bg-gray-50 rounded-2xl p-4">
            <Textarea
              style={{ width: '100%', minHeight: '100px', backgroundColor: 'transparent' }}
              placeholder="请输入备注信息..."
              value={formData.remarks}
              onInput={(e) => setFormData({ ...formData, remarks: e.detail.value })}
              maxlength={500}
            />
          </View>
        </CardContent>
      </Card>

      {/* 业务类型选择弹窗 */}
      <Dialog open={showBusinessTypePicker} onOpenChange={setShowBusinessTypePicker}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>选择业务类型</DialogTitle>
          </DialogHeader>

          {/* 搜索框 */}
          <View className="bg-gray-50 rounded-xl px-4 py-3 mb-4">
            <View className="flex items-center gap-2">
              <Search size={18} color="#9ca3af" />
              <Input
                className="flex-1 bg-transparent"
                placeholder="搜索业务类型..."
                value={searchKeyword}
                onInput={(e) => setSearchKeyword(e.detail.value)}
              />
            </View>
          </View>

          {/* 分类筛选 */}
          <View className="flex gap-2 mb-4">
            {categories.map((category) => (
              <Button
                key={category}
                size="sm"
                variant={selectedCategory === category ? "default" : "outline"}
                className={selectedCategory === category ? "bg-blue-500 text-white" : ""}
                onClick={() => setSelectedCategory(category)}
              >
                <Text className="text-xs">{category}</Text>
              </Button>
            ))}
          </View>

          {/* 业务类型列表 */}
          <View className="space-y-2 max-h-96 overflow-y-auto">
            {filteredBusinessTypes.map((type) => {
              const isSelected = selectedBusinessTypes.find(item => item.businessTypeId === type.id)

              return (
                <View
                  key={type.id}
                  className={`p-3 rounded-xl border-2 ${
                    isSelected ? 'border-blue-500 bg-blue-50' : 'border-gray-200 bg-white'
                  }`}
                  onClick={() => handleSelectBusinessType(type)}
                >
                  <View className="flex items-center justify-between">
                    <View className="flex items-center gap-3">
                      <View className="w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center">
                        <Text className="text-2xl">{type.category === '计量' ? '📊' : '🔧'}</Text>
                      </View>
                      <View>
                        <Text className="block font-medium text-gray-900">{type.name}</Text>
                        <Text className="block text-xs text-gray-500">{type.category} · ¥{type.defaultPrice}/次</Text>
                      </View>
                    </View>
                    {isSelected ? (
                      <View className="flex items-center justify-center w-6 h-6 rounded-full bg-blue-500">
                        <Check size={14} color="#ffffff" />
                      </View>
                    ) : (
                      <Plus size={20} color="#1890ff" />
                    )}
                  </View>
                </View>
              )
            })}
          </View>

          <Button
            className="w-full mt-4"
            onClick={() => setShowBusinessTypePicker(false)}
          >
            确定
          </Button>
        </DialogContent>
      </Dialog>

      {/* 底部提交按钮 */}
      <View style={{ position: 'fixed', bottom: 0, left: 0, right: 0, padding: '16px', backgroundColor: '#ffffff', borderTop: '1px solid #e5e7eb', zIndex: 100 }}>
        <Button
          className="w-full bg-blue-500 text-white rounded-xl py-4 text-base font-medium"
          onClick={handleSubmit}
          disabled={loading}
        >
          <Save size={18} color="#ffffff" />
          <Text className="ml-2">创建订单</Text>
        </Button>
      </View>
    </View>
  )
}
