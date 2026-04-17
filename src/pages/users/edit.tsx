import { useState, useEffect } from 'react'
import Taro from '@tarojs/taro'
import { View, Text, ScrollView } from '@tarojs/components'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { ArrowLeft, Save, User, Phone } from 'lucide-react-taro'
import { Network } from '@/network'
import { UserRole, getRoleDisplayName } from '@/utils/permission'

// 新角色配置（8个角色）
const ROLE_OPTIONS = [
  { value: UserRole.SUPER_ADMIN, name: getRoleDisplayName(UserRole.SUPER_ADMIN) },
  { value: UserRole.TESTING_MANAGER, name: getRoleDisplayName(UserRole.TESTING_MANAGER) },
  { value: UserRole.ENGINEERING_MANAGER, name: getRoleDisplayName(UserRole.ENGINEERING_MANAGER) },
  { value: UserRole.FINANCE, name: getRoleDisplayName(UserRole.FINANCE) },
  { value: UserRole.BUSINESS_MANAGER, name: getRoleDisplayName(UserRole.BUSINESS_MANAGER) },
  { value: UserRole.TESTING_WORKER, name: getRoleDisplayName(UserRole.TESTING_WORKER) },
  { value: UserRole.INSTALLATION_WORKER, name: getRoleDisplayName(UserRole.INSTALLATION_WORKER) },
  { value: UserRole.CERTIFICATE_MAKER, name: getRoleDisplayName(UserRole.CERTIFICATE_MAKER) },
]

const COMPANY_OPTIONS = [
  { value: 'sanheng_jiliang', name: '叁恒计量' },
  { value: 'sanheng_zhian', name: '叁恒智安' },
]

export default function UserEditPage() {
  const [loading, setLoading] = useState(false)
  const [saving, setSaving] = useState(false)
  const [mode, setMode] = useState<'add' | 'edit'>('add')
  const [userId, setUserId] = useState('')

  // 表单数据
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    roles: [] as string[],
    company: 'sanheng_jiliang',
  })

  useEffect(() => {
    const { id, mode: modeParam } = Taro.getCurrentInstance().router?.params || {}
    if (id && modeParam === 'edit') {
      setMode('edit')
      setUserId(id)
      loadUserDetail(id)
    }
  }, [])

  const loadUserDetail = async (id: string) => {
    setLoading(true)
    try {
      const res = await Network.request({
        url: `/api/users/${id}`,
        method: 'GET',
      })

      if (res.data.code === 200) {
        const user = res.data.data
        setFormData({
          name: user.name || '',
          phone: user.phone || '',
          roles: Array.isArray(user.roles) ? user.roles : user.roles ? [user.roles] : [],
          company: user.company || 'sanheng_jiliang',
        })
      }
    } catch (error) {
      console.error('获取用户详情失败:', error)
      Taro.showToast({
        title: '加载失败',
        icon: 'none',
      })
    } finally {
      setLoading(false)
    }
  }

  const handleRoleToggle = (roleValue: string) => {
    setFormData((prev) => {
      if (prev.roles.includes(roleValue)) {
        // 至少保留一个角色
        if (prev.roles.length > 1) {
          return { ...prev, roles: prev.roles.filter(r => r !== roleValue) }
        }
        return prev
      } else {
        return { ...prev, roles: [...prev.roles, roleValue] }
      }
    })
  }

  const handleSubmit = async () => {
    if (!formData.name) {
      Taro.showToast({
        title: '请输入姓名',
        icon: 'none',
      })
      return
    }

    if (formData.roles.length === 0) {
      Taro.showToast({
        title: '请选择角色',
        icon: 'none',
      })
      return
    }

    setSaving(true)
    try {
      const url = mode === 'add' ? '/api/users' : `/api/users/${userId}`
      const method = mode === 'add' ? 'POST' : 'PUT'

      const res = await Network.request({
        url,
        method,
        data: formData,
      })

      if (res.data.code === 200) {
        Taro.showToast({
          title: mode === 'add' ? '创建成功' : '更新成功',
          icon: 'success',
        })
        setTimeout(() => {
          Taro.navigateBack()
        }, 1500)
      } else {
        Taro.showToast({
          title: res.data.msg || '操作失败',
          icon: 'none',
        })
      }
    } catch (error) {
      console.error('保存失败:', error)
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
          <Text className="block text-xl font-bold text-white">
            {mode === 'add' ? '新增用户' : '编辑用户'}
          </Text>
        </View>
      </View>

      <ScrollView scrollY className="flex-1 p-4 pb-32">
        {/* 基本信息 */}
        <Card className="mb-4">
          <CardHeader>
            <CardTitle className="text-base">基本信息</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* 姓名 */}
            <View>
              <View className="flex items-center gap-2 mb-2">
                <User size={16} color="#6b7280" />
                <Text className="block text-sm text-gray-700">姓名</Text>
              </View>
              <View className="bg-gray-50 rounded-xl px-4 py-3">
                <Input
                  className="w-full bg-transparent"
                  placeholder="请输入姓名"
                  value={formData.name}
                  onInput={(e) => setFormData({ ...formData, name: e.detail.value })}
                />
              </View>
            </View>

            {/* 手机号 */}
            <View>
              <View className="flex items-center gap-2 mb-2">
                <Phone size={16} color="#6b7280" />
                <Text className="block text-sm text-gray-700">手机号</Text>
              </View>
              <View className="bg-gray-50 rounded-xl px-4 py-3">
                <Input
                  className="w-full bg-transparent"
                  type="number"
                  placeholder="请输入手机号"
                  value={formData.phone}
                  onInput={(e) => setFormData({ ...formData, phone: e.detail.value })}
                />
              </View>
            </View>
          </CardContent>
        </Card>

        {/* 角色选择 */}
        <Card className="mb-4">
          <CardHeader>
            <CardTitle className="text-base">角色选择（可多选）</CardTitle>
          </CardHeader>
          <CardContent>
            <View className="space-y-2">
              {ROLE_OPTIONS.map((role) => {
                const isSelected = formData.roles.includes(role.value)
                return (
                  <View
                    key={role.value}
                    className={`p-3 rounded-xl flex items-center justify-between ${
                      isSelected ? 'bg-blue-50 border-2 border-blue-500' : 'bg-gray-50'
                    }`}
                    onClick={() => handleRoleToggle(role.value)}
                  >
                    <Text className={`text-sm ${isSelected ? 'text-blue-700 font-medium' : 'text-gray-700'}`}>
                      {role.name}
                    </Text>
                    {isSelected && (
                      <View className="w-5 h-5 rounded-full bg-blue-500 flex items-center justify-center">
                        <Text className="text-white text-xs">✓</Text>
                      </View>
                    )}
                  </View>
                )
              })}
            </View>
          </CardContent>
        </Card>

        {/* 所属公司 */}
        <Card className="mb-4">
          <CardHeader>
            <CardTitle className="text-base">所属公司</CardTitle>
          </CardHeader>
          <CardContent>
            <View className="space-y-2">
              {COMPANY_OPTIONS.map((company) => {
                const isSelected = formData.company === company.value
                return (
                  <View
                    key={company.value}
                    className={`p-3 rounded-xl flex items-center justify-between ${
                      isSelected ? 'bg-blue-50 border-2 border-blue-500' : 'bg-gray-50'
                    }`}
                    onClick={() => setFormData({ ...formData, company: company.value })}
                  >
                    <Text className={`text-sm ${isSelected ? 'text-blue-700 font-medium' : 'text-gray-700'}`}>
                      {company.name}
                    </Text>
                    {isSelected && (
                      <View className="w-5 h-5 rounded-full bg-blue-500 flex items-center justify-center">
                        <Text className="text-white text-xs">✓</Text>
                      </View>
                    )}
                  </View>
                )
              })}
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
          <Text className="ml-2">{saving ? '保存中...' : mode === 'add' ? '创建用户' : '保存修改'}</Text>
        </Button>
      </View>
    </View>
  )
}
