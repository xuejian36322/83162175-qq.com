import { View, Text } from '@tarojs/components'
import Taro from '@tarojs/taro'
import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Network } from '@/network'
import { MapPin, Save, X } from 'lucide-react-taro'

export default function OrderCreatePage() {
  const [loading, setLoading] = useState(false)
  const [userInfo, setUserInfo] = useState<any>(null)

  // 表单数据
  const [formData, setFormData] = useState({
    // 基本信息
    orderDate: new Date().toISOString().split('T')[0],
    customerName: '',
    invoiceCompanyName: '',
    reportName: '',
    companyName: 'sanheng_jiliang',

    // 业务信息
    businessType: '',
    quantity: 1,
    unitPrice: '',
    contractAmount: '',
    actualAmount: '',

    // 费用相关
    commissionStandard: '',
    commissionFee: '',
    thirdPartyCollection: '',
    transportFee: '',
    taxFee: '',
    deposit: '',

    // 工费相关（智安）
    laborFee: '',
    laborFeeRemaining: '',

    // 人员信息
    sourceUserId: '',
    executor1Id: '',
    executor2Id: '',

    // 日期信息
    executionDate: '',
    commissionDate: '',
    paymentDate: '',

    // 枚举字段
    paymentMethod: '开票收款',
    status: 'pending',
    reportType: '',
    testResult: '',

    // 联系信息
    contactPerson: '',
    contactPhone: '',
    address: '',

    // 位置信息
    locationLatitude: '',
    locationLongitude: '',

    // 其他信息
    trackingNumber: '',
    remarks: '',
  })

  // 业务类型选项
  const businessTypeOptions = [
    '燃气报警器检测',
    '燃气报警器安装',
    '燃气报警器检定',
    '管道改造',
    '风机安装',
    '压力表检测',
  ]

  useEffect(() => {
    const user = Taro.getStorageSync('userInfo')
    if (!user) {
      Taro.redirectTo({ url: '/pages/login/index' })
      return
    }
    setUserInfo(user)
  }, [])

  // 自动计算合同金额
  useEffect(() => {
    const quantity = parseFloat(formData.quantity.toString()) || 0
    const unitPrice = parseFloat(formData.unitPrice.toString()) || 0
    const contractAmount = (quantity * unitPrice).toFixed(2)
    setFormData((prev) => ({
      ...prev,
      contractAmount,
    }))
  }, [formData.quantity, formData.unitPrice])

  // 自动计算居间费
  useEffect(() => {
    const contractAmount = parseFloat(formData.contractAmount.toString()) || 0
    const commissionStandard = parseFloat(formData.commissionStandard.toString()) || 0
    const quantity = parseFloat(formData.quantity.toString()) || 0
    const commissionFee = (contractAmount - commissionStandard * quantity).toFixed(2)
    setFormData((prev) => ({
      ...prev,
      commissionFee,
    }))
  }, [formData.contractAmount, formData.commissionStandard, formData.quantity])

  // 地图选点
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
      Taro.showToast({
        title: '选择位置失败',
        icon: 'none',
      })
    }
  }

  // 处理输入变化
  const handleInputChange = (field: string, value: string | number) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

  // 提交表单
  const handleSubmit = async () => {
    // 基础验证
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
        data: {
          ...formData,
          managerId: userInfo?.id,
        },
        header: {
          Authorization: `Bearer ${token}`,
        },
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
        title: '创建失败，请重试',
        icon: 'none',
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <View className="min-h-screen bg-gray-50 pb-20">
      {/* 基本信息 */}
      <Card className="m-4">
        <CardHeader>
          <CardTitle className="text-base">基本信息</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <View>
            <Text className="block text-sm text-gray-600 mb-2">
              客户名称 <Text className="text-red-500">*</Text>
            </Text>
            <Input
              className="w-full"
              placeholder="请输入客户名称"
              value={formData.customerName}
              onInput={(e) => handleInputChange('customerName', e.detail.value)}
            />
          </View>

          <View>
            <Text className="block text-sm text-gray-600 mb-2">开票单位名称</Text>
            <Input
              className="w-full"
              placeholder="请输入开票单位名称"
              value={formData.invoiceCompanyName}
              onInput={(e) => handleInputChange('invoiceCompanyName', e.detail.value)}
            />
          </View>

          <View>
            <Text className="block text-sm text-gray-600 mb-2">报告名称</Text>
            <Input
              className="w-full"
              placeholder="请输入报告名称（计量业务）"
              value={formData.reportName}
              onInput={(e) => handleInputChange('reportName', e.detail.value)}
            />
          </View>

          <View>
            <Text className="block text-sm text-gray-600 mb-2">
              所属公司
            </Text>
            <View className="flex gap-2">
              <Button
                size="sm"
                variant={formData.companyName === 'sanheng_jiliang' ? 'default' : 'outline'}
                onClick={() => handleInputChange('companyName', 'sanheng_jiliang')}
              >
                叁恒计量
              </Button>
              <Button
                size="sm"
                variant={formData.companyName === 'sanheng_zhian' ? 'default' : 'outline'}
                onClick={() => handleInputChange('companyName', 'sanheng_zhian')}
              >
                叁恒智安
              </Button>
            </View>
          </View>
        </CardContent>
      </Card>

      {/* 业务信息 */}
      <Card className="m-4">
        <CardHeader>
          <CardTitle className="text-base">业务信息</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <View>
            <Text className="block text-sm text-gray-600 mb-2">
              业务类型 <Text className="text-red-500">*</Text>
            </Text>
            <View className="space-y-2">
              {businessTypeOptions.map((option) => (
                <View
                  key={option}
                  className={`p-3 rounded-lg border ${
                    formData.businessType === option
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-200'
                  }`}
                  onClick={() => handleInputChange('businessType', option)}
                >
                  <Text className="text-sm">{option}</Text>
                </View>
              ))}
              <Input
                className="w-full"
                placeholder="或自定义业务类型"
                value={
                  !businessTypeOptions.includes(formData.businessType)
                    ? formData.businessType
                    : ''
                }
                onInput={(e) => handleInputChange('businessType', e.detail.value)}
              />
            </View>
          </View>

          <View className="flex gap-2">
            <View className="flex-1">
              <Text className="block text-sm text-gray-600 mb-2">
                数量 <Text className="text-red-500">*</Text>
              </Text>
              <Input
                type="number"
                className="w-full"
                placeholder="请输入数量"
                value={formData.quantity.toString()}
                onInput={(e) => handleInputChange('quantity', e.detail.value)}
              />
            </View>

            <View className="flex-1">
              <Text className="block text-sm text-gray-600 mb-2">
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
            <Text className="block text-sm text-gray-600 mb-2">合同金额（元）</Text>
            <Input
              type="digit"
              className="w-full bg-gray-50"
              placeholder="自动计算"
              value={formData.contractAmount}
              disabled
            />
          </View>

          <View>
            <Text className="block text-sm text-gray-600 mb-2">实收金额（元）</Text>
            <Input
              type="digit"
              className="w-full"
              placeholder="请输入实收金额"
              value={formData.actualAmount}
              onInput={(e) => handleInputChange('actualAmount', e.detail.value)}
            />
          </View>
        </CardContent>
      </Card>

      {/* 费用信息 */}
      <Card className="m-4">
        <CardHeader>
          <CardTitle className="text-base">费用信息</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <View>
            <Text className="block text-sm text-gray-600 mb-2">居间标准（元/个）</Text>
            <Input
              type="digit"
              className="w-full"
              placeholder="请输入居间标准"
              value={formData.commissionStandard}
              onInput={(e) => handleInputChange('commissionStandard', e.detail.value)}
            />
          </View>

          <View>
            <Text className="block text-sm text-gray-600 mb-2">居间费用（元）</Text>
            <Input
              type="digit"
              className="w-full bg-gray-50"
              placeholder="自动计算"
              value={formData.commissionFee}
              disabled
            />
          </View>

          <View>
            <Text className="block text-sm text-gray-600 mb-2">三方代收（元）</Text>
            <Input
              type="digit"
              className="w-full"
              placeholder="外包方直接收款金额"
              value={formData.thirdPartyCollection}
              onInput={(e) => handleInputChange('thirdPartyCollection', e.detail.value)}
            />
          </View>

          <View>
            <Text className="block text-sm text-gray-600 mb-2">路费（元）</Text>
            <Input
              type="digit"
              className="w-full"
              placeholder="请输入路费"
              value={formData.transportFee}
              onInput={(e) => handleInputChange('transportFee', e.detail.value)}
            />
          </View>
        </CardContent>
      </Card>

      {/* 联系信息 */}
      <Card className="m-4">
        <CardHeader>
          <CardTitle className="text-base">联系信息</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <View>
            <Text className="block text-sm text-gray-600 mb-2">联系人</Text>
            <Input
              className="w-full"
              placeholder="请输入联系人"
              value={formData.contactPerson}
              onInput={(e) => handleInputChange('contactPerson', e.detail.value)}
            />
          </View>

          <View>
            <Text className="block text-sm text-gray-600 mb-2">联系电话</Text>
            <Input
              type="number"
              className="w-full"
              placeholder="请输入联系电话"
              value={formData.contactPhone}
              onInput={(e) => handleInputChange('contactPhone', e.detail.value)}
            />
          </View>

          <View>
            <Text className="block text-sm text-gray-600 mb-2">客户地址</Text>
            <Textarea
              className="w-full"
              placeholder="请输入客户地址"
              value={formData.address}
              onInput={(e) => handleInputChange('address', e.detail.value)}
              maxlength={200}
            />
          </View>

          <Button
            variant="outline"
            size="sm"
            onClick={handleChooseLocation}
          >
            <MapPin size={16} color="#1890ff" />
            <Text className="ml-2">选择位置</Text>
          </Button>

          {formData.locationLatitude && (
            <View className="p-2 bg-blue-50 rounded-lg">
              <Text className="text-xs text-blue-600">
                已选择位置：{formData.locationLatitude},{' '}
                {formData.locationLongitude}
              </Text>
            </View>
          )}
        </CardContent>
      </Card>

      {/* 其他信息 */}
      <Card className="m-4">
        <CardHeader>
          <CardTitle className="text-base">其他信息</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <View>
            <Text className="block text-sm text-gray-600 mb-2">运单号</Text>
            <Input
              className="w-full"
              placeholder="请输入运单号"
              value={formData.trackingNumber}
              onInput={(e) => handleInputChange('trackingNumber', e.detail.value)}
            />
          </View>

          <View>
            <Text className="block text-sm text-gray-600 mb-2">备注</Text>
            <Textarea
              className="w-full"
              placeholder="请输入备注信息"
              value={formData.remarks}
              onInput={(e) => handleInputChange('remarks', e.detail.value)}
              maxlength={500}
            />
          </View>
        </CardContent>
      </Card>

      {/* 底部按钮 */}
      <View className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4 z-50">
        <View className="flex gap-3">
          <Button
            className="flex-1"
            variant="outline"
            onClick={() => Taro.navigateBack()}
          >
            <X size={20} color="#1890ff" />
            <Text className="ml-2">取消</Text>
          </Button>
          <Button
            className="flex-1"
            onClick={handleSubmit}
            disabled={loading}
          >
            <Save size={20} color="#ffffff" />
            <Text className="ml-2">{loading ? '提交中...' : '保存订单'}</Text>
          </Button>
        </View>
      </View>
    </View>
  )
}
