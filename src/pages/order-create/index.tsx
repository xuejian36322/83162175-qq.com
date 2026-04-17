import { View, Text } from '@tarojs/components'
import Taro from '@tarojs/taro'
import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Network } from '@/network'
import { MapPin, Save, X, Plus, Minus, ChevronRight, User, Building2, FileText, Calculator, DollarSign } from 'lucide-react-taro'

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
    businessType: '',
    quantity: 1,
    unitPrice: '',
    contractAmount: '',
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

  const businessTypeOptions = [
    { name: '燃气报警器检测', icon: '🔥', popular: true },
    { name: '燃气报警器安装', icon: '🔧', popular: true },
    { name: '燃气报警器检定', icon: '✓', popular: true },
    { name: '管道改造', icon: '🔨', popular: false },
    { name: '风机安装', icon: '🌀', popular: false },
    { name: '压力表检测', icon: '📊', popular: false },
  ]

  useEffect(() => {
    const user = Taro.getStorageSync('userInfo')
    if (!user) {
      Taro.redirectTo({ url: '/pages/login/index' })
      return
    }
    setUserInfo(user)
  }, [])

  useEffect(() => {
    const quantity = parseFloat(formData.quantity.toString()) || 0
    const unitPrice = parseFloat(formData.unitPrice.toString()) || 0
    const contractAmount = (quantity * unitPrice).toFixed(2)
    setFormData((prev) => ({ ...prev, contractAmount }))
  }, [formData.quantity, formData.unitPrice])

  useEffect(() => {
    const contractAmount = parseFloat(formData.contractAmount.toString()) || 0
    const commissionStandard = parseFloat(formData.commissionStandard.toString()) || 0
    const quantity = parseFloat(formData.quantity.toString()) || 0
    const commissionFee = (contractAmount - commissionStandard * quantity).toFixed(2)
    setFormData((prev) => ({ ...prev, commissionFee }))
  }, [formData.contractAmount, formData.commissionStandard, formData.quantity])

  const handleChooseLocation = async () => {
    try {
      const location = await Taro.chooseLocation({})
      setFormData((prev) => ({
        ...prev,
        address: location.address,
        locationLatitude: location.latitude.toString(),
        locationLongitude: location.longitude.toString(),
      }))
    } catch (error) {
      console.error('选择位置失败:', error)
      Taro.showToast({ title: '选择位置失败', icon: 'none' })
    }
  }

  const handleInputChange = (field: string, value: string | number) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleQuantityChange = (delta: number) => {
    const newValue = Math.max(1, (parseInt(formData.quantity.toString()) || 0) + delta)
    handleInputChange('quantity', newValue)
  }

  const handleSubmit = async () => {
    if (!formData.customerName) {
      Taro.showToast({ title: '请输入客户名称', icon: 'none' })
      return
    }
    if (!formData.businessType) {
      Taro.showToast({ title: '请选择业务类型', icon: 'none' })
      return
    }
    if (!formData.quantity || !formData.unitPrice) {
      Taro.showToast({ title: '请输入数量和单价', icon: 'none' })
      return
    }

    setLoading(true)

    try {
      const token = Taro.getStorageSync('token')

      const res = await Network.request({
        url: '/api/orders',
        method: 'POST',
        data: { ...formData, managerId: userInfo?.id },
        header: { Authorization: `Bearer ${token}` },
      })

      console.log('创建订单响应:', res)

      if (res.data.code === 200) {
        Taro.showToast({ title: '创建成功', icon: 'success' })
        setTimeout(() => Taro.navigateBack(), 1500)
      } else {
        Taro.showToast({ title: res.data.msg || '创建失败', icon: 'none' })
      }
    } catch (error) {
      console.error('创建订单失败:', error)
      Taro.showToast({ title: '创建失败，请重试', icon: 'none' })
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
        <CardContent className="space-y-4">
          <View>
            <Text className="block text-sm font-medium text-gray-700 mb-2">
              客户名称 <Text className="text-red-500">*</Text>
            </Text>
            <View className="relative">
              <Input
                className="w-full border-blue-200 focus:border-blue-500"
                placeholder="请输入客户名称"
                value={formData.customerName}
                onInput={(e) => handleInputChange('customerName', e.detail.value)}
              />
              {formData.customerName && (
                <View className="absolute right-3 top-1/2 -translate-y-1/2">
                  <ChevronRight size={16} color="#1890ff" />
                </View>
              )}
            </View>
          </View>

          <View>
            <Text className="block text-sm font-medium text-gray-700 mb-2">开票单位名称</Text>
            <Input
              className="w-full"
              placeholder="请输入开票单位名称（选填）"
              value={formData.invoiceCompanyName}
              onInput={(e) => handleInputChange('invoiceCompanyName', e.detail.value)}
            />
          </View>

          <View>
            <Text className="block text-sm font-medium text-gray-700 mb-2">报告名称</Text>
            <Input
              className="w-full"
              placeholder="请输入报告名称（计量业务）"
              value={formData.reportName}
              onInput={(e) => handleInputChange('reportName', e.detail.value)}
            />
          </View>

          <View>
            <Text className="block text-sm font-medium text-gray-700 mb-2">所属公司</Text>
            <View className="flex gap-3">
              <Button
                size="sm"
                className={`flex-1 ${
                  formData.companyName === 'sanheng_jiliang'
                    ? 'bg-blue-500 text-white'
                    : 'bg-gray-100 text-gray-700'
                }`}
                onClick={() => handleInputChange('companyName', 'sanheng_jiliang')}
              >
                叁恒计量
              </Button>
              <Button
                size="sm"
                className={`flex-1 ${
                  formData.companyName === 'sanheng_zhian'
                    ? 'bg-green-500 text-white'
                    : 'bg-gray-100 text-gray-700'
                }`}
                onClick={() => handleInputChange('companyName', 'sanheng_zhian')}
              >
                叁恒智安
              </Button>
            </View>
          </View>
        </CardContent>
      </Card>

      {/* 业务信息 */}
      <Card className="mx-4 mb-4">
        <CardHeader className="pb-3">
          <View className="flex items-center justify-between">
            <View className="flex items-center gap-2">
              <FileText size={18} color="#52c41a" />
              <CardTitle className="text-base">业务信息</CardTitle>
            </View>
            <Badge variant="outline" className="text-xs">必填</Badge>
          </View>
        </CardHeader>
        <CardContent className="space-y-4">
          <View>
            <Text className="block text-sm font-medium text-gray-700 mb-2">
              业务类型 <Text className="text-red-500">*</Text>
            </Text>
            <View className="grid grid-cols-2 gap-2">
              {businessTypeOptions.map((option) => (
                <View
                  key={option.name}
                  className={`relative p-3 rounded-lg border-2 text-center transition-all ${
                    formData.businessType === option.name
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                  onClick={() => handleInputChange('businessType', option.name)}
                >
                  <Text className="text-2xl mb-1">{option.icon}</Text>
                  <Text className="text-xs font-medium">{option.name}</Text>
                  {option.popular && (
                    <Badge className="absolute top-1 right-1 px-1 py-0 text-[10px] bg-orange-500">
                      热
                    </Badge>
                  )}
                </View>
              ))}
            </View>
            <Input
              className="w-full mt-2"
              placeholder="或自定义业务类型"
              value={
                !businessTypeOptions.map(o => o.name).includes(formData.businessType)
                  ? formData.businessType
                  : ''
              }
              onInput={(e) => handleInputChange('businessType', e.detail.value)}
            />
          </View>

          <View className="flex gap-3">
            <View className="flex-1">
              <Text className="block text-sm font-medium text-gray-700 mb-2">
                数量 <Text className="text-red-500">*</Text>
              </Text>
              <View className="flex items-center gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  className="w-10 h-10 p-0"
                  onClick={() => handleQuantityChange(-1)}
                >
                  <Minus size={16} color="#666" />
                </Button>
                <Input
                  type="number"
                  className="flex-1 text-center font-bold"
                  value={formData.quantity.toString()}
                  onInput={(e) => handleInputChange('quantity', e.detail.value)}
                />
                <Button
                  size="sm"
                  variant="outline"
                  className="w-10 h-10 p-0"
                  onClick={() => handleQuantityChange(1)}
                >
                  <Plus size={16} color="#666" />
                </Button>
              </View>
            </View>

            <View className="flex-1">
              <Text className="block text-sm font-medium text-gray-700 mb-2">
                单价（元） <Text className="text-red-500">*</Text>
              </Text>
              <Input
                type="digit"
                className="w-full"
                placeholder="请输入单价"
                value={formData.unitPrice}
                onInput={(e) => handleInputChange('unitPrice', e.detail.value)}
              />
            </View>
          </View>

          <View>
            <Text className="block text-sm font-medium text-gray-700 mb-2">
              合同金额（元）
            </Text>
            <View className="relative">
              <DollarSign size={18} color="#1890ff" className="absolute left-3 top-1/2 -translate-y-1/2" />
              <Input
                type="digit"
                className="w-full bg-gradient-to-r from-blue-50 to-blue-100 pl-10 text-blue-600 font-bold"
                placeholder="自动计算"
                value={formData.contractAmount}
                disabled
              />
            </View>
          </View>

          <View>
            <Text className="block text-sm font-medium text-gray-700 mb-2">实收金额（元）</Text>
            <Input
              type="digit"
              className="w-full"
              placeholder="请输入实收金额（选填）"
              value={formData.actualAmount}
              onInput={(e) => handleInputChange('actualAmount', e.detail.value)}
            />
          </View>
        </CardContent>
      </Card>

      {/* 费用信息 */}
      <Card className="mx-4 mb-4">
        <CardHeader className="pb-3">
          <View className="flex items-center gap-2">
            <Calculator size={18} color="#fa8c16" />
            <CardTitle className="text-base">费用信息</CardTitle>
          </View>
        </CardHeader>
        <CardContent className="space-y-4">
          <View>
            <Text className="block text-sm font-medium text-gray-700 mb-2">居间标准（元/个）</Text>
            <Input
              type="digit"
              className="w-full"
              placeholder="请输入居间标准"
              value={formData.commissionStandard}
              onInput={(e) => handleInputChange('commissionStandard', e.detail.value)}
            />
          </View>

          <View>
            <Text className="block text-sm font-medium text-gray-700 mb-2">居间费用（元）</Text>
            <View className="relative">
              <DollarSign size={18} color="#52c41a" className="absolute left-3 top-1/2 -translate-y-1/2" />
              <Input
                type="digit"
                className="w-full bg-gradient-to-r from-green-50 to-green-100 pl-10 text-green-600 font-bold"
                placeholder="自动计算"
                value={formData.commissionFee}
                disabled
              />
            </View>
          </View>

          <View className="grid grid-cols-2 gap-3">
            <View>
              <Text className="block text-sm font-medium text-gray-700 mb-2">三方代收</Text>
              <Input
                type="digit"
                className="w-full"
                placeholder="0"
                value={formData.thirdPartyCollection}
                onInput={(e) => handleInputChange('thirdPartyCollection', e.detail.value)}
              />
            </View>

            <View>
              <Text className="block text-sm font-medium text-gray-700 mb-2">路费</Text>
              <Input
                type="digit"
                className="w-full"
                placeholder="0"
                value={formData.transportFee}
                onInput={(e) => handleInputChange('transportFee', e.detail.value)}
              />
            </View>
          </View>
        </CardContent>
      </Card>

      {/* 联系信息 */}
      <Card className="mx-4 mb-4">
        <CardHeader className="pb-3">
          <View className="flex items-center gap-2">
            <MapPin size={18} color="#1890ff" />
            <CardTitle className="text-base">联系信息</CardTitle>
          </View>
        </CardHeader>
        <CardContent className="space-y-4">
          <View>
            <Text className="block text-sm font-medium text-gray-700 mb-2">联系人</Text>
            <Input
              className="w-full"
              placeholder="请输入联系人"
              value={formData.contactPerson}
              onInput={(e) => handleInputChange('contactPerson', e.detail.value)}
            />
          </View>

          <View>
            <Text className="block text-sm font-medium text-gray-700 mb-2">联系电话</Text>
            <Input
              type="number"
              className="w-full"
              placeholder="请输入联系电话"
              value={formData.contactPhone}
              onInput={(e) => handleInputChange('contactPhone', e.detail.value)}
            />
          </View>

          <View>
            <Text className="block text-sm font-medium text-gray-700 mb-2">客户地址</Text>
            <Textarea
              className="w-full"
              placeholder="请输入客户地址"
              value={formData.address}
              onInput={(e) => handleInputChange('address', e.detail.value)}
              maxlength={200}
            />
          </View>

          <Button
            className="w-full bg-blue-50 text-blue-600 border-blue-200"
            variant="outline"
            onClick={handleChooseLocation}
          >
            <MapPin size={18} color="#1890ff" />
            <Text className="ml-2">📍 地图选点</Text>
          </Button>

          {formData.locationLatitude && (
            <View className="p-3 bg-gradient-to-r from-blue-50 to-blue-100 rounded-lg border border-blue-200">
              <View className="flex items-center gap-2">
                <MapPin size={16} color="#1890ff" />
                <Text className="text-sm text-blue-600 font-medium">
                  已选择位置
                </Text>
              </View>
              <Text className="text-xs text-blue-500 mt-1">
                {formData.locationLatitude}, {formData.locationLongitude}
              </Text>
            </View>
          )}
        </CardContent>
      </Card>

      {/* 其他信息 */}
      <Card className="mx-4 mb-4">
        <CardHeader className="pb-3">
          <View className="flex items-center gap-2">
            <FileText size={18} color="#722ed1" />
            <CardTitle className="text-base">其他信息</CardTitle>
          </View>
        </CardHeader>
        <CardContent className="space-y-4">
          <View>
            <Text className="block text-sm font-medium text-gray-700 mb-2">运单号</Text>
            <Input
              className="w-full"
              placeholder="请输入运单号（选填）"
              value={formData.trackingNumber}
              onInput={(e) => handleInputChange('trackingNumber', e.detail.value)}
            />
          </View>

          <View>
            <Text className="block text-sm font-medium text-gray-700 mb-2">备注</Text>
            <Textarea
              className="w-full"
              placeholder="请输入备注信息（选填）"
              value={formData.remarks}
              onInput={(e) => handleInputChange('remarks', e.detail.value)}
              maxlength={500}
            />
          </View>
        </CardContent>
      </Card>

      {/* 底部按钮 */}
      <View className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4 z-50 shadow-lg">
        <View className="flex gap-3">
          <Button
            className="flex-1"
            variant="outline"
            onClick={() => Taro.navigateBack()}
          >
            <X size={20} color="#666" />
            <Text className="ml-2">取消</Text>
          </Button>
          <Button
            className="flex-1 bg-gradient-to-r from-blue-500 to-blue-600"
            onClick={handleSubmit}
            disabled={loading}
          >
            {loading ? (
              <Text className="ml-2">提交中...</Text>
            ) : (
              <>
                <Save size={20} color="#ffffff" />
                <Text className="ml-2">保存订单</Text>
              </>
            )}
          </Button>
        </View>
      </View>
    </View>
  )
}
