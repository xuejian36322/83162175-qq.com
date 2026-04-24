import { useState, useEffect } from 'react'
import Taro from '@tarojs/taro'
import { View, Text, ScrollView } from '@tarojs/components'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { ArrowLeft, Save, LogOut, UserCheck, ShieldCheck } from 'lucide-react-taro'
import { isSuperAdmin } from '@/utils/permission'

export default function SystemSettingsPage() {
  const [saving, setSaving] = useState(false)

  const [settings, setSettings] = useState({
    companyName: '陕西叁恒',
    commissionRate: '10',
    overtimeLockHours: '24',
    maxPhotos: '9',
  })

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

    loadSettings()
  }, [])

  const loadSettings = async () => {
    try {
      // 模拟加载设置
    } catch (error) {
      console.error('加载设置失败:', error)
    }
  }

  const handleSave = async () => {
    setSaving(true)
    try {
      // 保存设置
      Taro.showToast({
        title: '保存成功',
        icon: 'success',
      })
    } catch (error) {
      Taro.showToast({
        title: '保存失败',
        icon: 'none',
      })
    } finally {
      setSaving(false)
    }
  }

  const handleLogout = () => {
    Taro.showModal({
      title: '退出登录',
      content: '确定要退出登录吗？',
      success: (res) => {
        if (res.confirm) {
          Taro.clearStorageSync()
          Taro.reLaunch({ url: '/pages/login/index' })
        }
      },
    })
  }

  return (
    <View className="min-h-screen bg-gray-50">
      <View className="bg-gradient-to-r from-blue-500 to-blue-600 px-4 py-4">
        <View className="flex items-center gap-3">
          <Button size="sm" variant="ghost" onClick={() => Taro.navigateBack()} className="text-white border-white opacity-50">
            <ArrowLeft size={20} color="#ffffff" />
          </Button>
          <Text className="block text-xl font-bold text-white">系统设置</Text>
        </View>
      </View>

      <ScrollView scrollY className="flex-1 p-4 pb-32">
        <Card className="mb-4">
          <CardHeader>
            <CardTitle className="text-base">基本信息</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <View>
              <Text className="block text-sm text-gray-700 mb-2">公司名称</Text>
              <View className="bg-gray-50 rounded-xl px-4 py-3">
                <Input
                  className="w-full bg-transparent"
                  placeholder="请输入公司名称"
                  value={settings.companyName}
                  onInput={(e) => setSettings({ ...settings, companyName: e.detail.value })}
                />
              </View>
            </View>
          </CardContent>
        </Card>

        {/* 超级管理员专属功能 */}
        {isSuperAdmin() && (
          <Card className="mb-4">
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <ShieldCheck size={18} color="#ef4444" />
                超级管理员功能
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button
                className="w-full bg-orange-500 text-white"
                onClick={() => Taro.navigateTo({ url: '/pages/user-approval/index' })}
              >
                <UserCheck size={18} color="#ffffff" />
                <Text className="ml-2">用户审批管理</Text>
              </Button>
              <Text className="block text-xs text-gray-500 text-center">
                管理新用户注册审批
              </Text>
            </CardContent>
          </Card>
        )}

        <Card className="mb-4">
          <CardHeader>
            <CardTitle className="text-base">业务配置</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <View>
              <Text className="block text-sm text-gray-700 mb-2">居间费率（%）</Text>
              <View className="bg-gray-50 rounded-xl px-4 py-3">
                <Input
                  className="w-full bg-transparent"
                  type="digit"
                  placeholder="请输入居间费率"
                  value={settings.commissionRate}
                  onInput={(e) => setSettings({ ...settings, commissionRate: e.detail.value })}
                />
              </View>
            </View>

            <View>
              <Text className="block text-sm text-gray-700 mb-2">锁定超时时间（小时）</Text>
              <View className="bg-gray-50 rounded-xl px-4 py-3">
                <Input
                  className="w-full bg-transparent"
                  type="digit"
                  placeholder="请输入超时时间"
                  value={settings.overtimeLockHours}
                  onInput={(e) => setSettings({ ...settings, overtimeLockHours: e.detail.value })}
                />
              </View>
            </View>

            <View>
              <Text className="block text-sm text-gray-700 mb-2">最大照片数量</Text>
              <View className="bg-gray-50 rounded-xl px-4 py-3">
                <Input
                  className="w-full bg-transparent"
                  type="digit"
                  placeholder="请输入最大照片数"
                  value={settings.maxPhotos}
                  onInput={(e) => setSettings({ ...settings, maxPhotos: e.detail.value })}
                />
              </View>
            </View>
          </CardContent>
        </Card>

        <Card className="mb-4">
          <CardHeader>
            <CardTitle className="text-base">危险操作</CardTitle>
          </CardHeader>
          <CardContent>
            <Button
              className="w-full bg-red-500 text-white"
              onClick={handleLogout}
            >
              <LogOut size={18} color="#ffffff" />
              <Text className="ml-2">退出登录</Text>
            </Button>
          </CardContent>
        </Card>
      </ScrollView>

      <View style={{ position: 'fixed', bottom: 0, left: 0, right: 0, padding: '16px', backgroundColor: '#ffffff', borderTop: '1px solid #e5e7eb', zIndex: 100 }}>
        <Button className="w-full bg-blue-500 text-white rounded-xl py-4" onClick={handleSave} disabled={saving}>
          <Save size={18} color="#ffffff" />
          <Text className="ml-2">{saving ? '保存中...' : '保存设置'}</Text>
        </Button>
      </View>
    </View>
  )
}
