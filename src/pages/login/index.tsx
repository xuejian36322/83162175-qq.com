import { View, Text } from '@tarojs/components'
import Taro from '@tarojs/taro'
import { useState } from 'react'
import { Network } from '@/network'
import { Button } from '@/components/ui/button'

export default function LoginPage() {
  const [loading, setLoading] = useState(false)

  const handleLogin = async () => {
    setLoading(true)

    try {
      // 🔴 测试模式：使用模拟 code
      const code = 'test_user_' + Date.now()

      // 调用后端登录接口
      const res = await Network.request({
        url: '/api/auth/wx-login',
        method: 'POST',
        data: { code },
      })

      console.log('登录响应:', res)

      if (res.data.code === 200) {
        const { token, user } = res.data.data

        // 检查审批状态
        if (user.approval_status === 'pending') {
          Taro.setStorageSync('token', token)
          Taro.setStorageSync('userInfo', user)

          Taro.showModal({
            title: '等待审批',
            content: '您的注册申请已提交，请联系管理员（18700999611）审批后才能使用系统',
            showCancel: false,
            success: () => {
              Taro.reLaunch({
                url: '/pages/login/index',
              })
            },
          })
          return
        }

        if (user.approval_status === 'rejected') {
          Taro.showToast({
            title: '注册已被拒绝',
            icon: 'none',
            duration: 2000,
          })
          return
        }

        // 保存 token 和用户信息
        Taro.setStorageSync('token', token)
        Taro.setStorageSync('userInfo', user)

        Taro.showToast({
          title: '登录成功',
          icon: 'success',
        })

        // 跳转到角色选择页面
        setTimeout(() => {
          Taro.reLaunch({
            url: '/pages/role-select/index',
          })
        }, 1500)
      } else {
        Taro.showToast({
          title: res.data.msg || '登录失败',
          icon: 'none',
        })
      }
    } catch (error) {
      console.error('登录失败:', error)
      Taro.showToast({
        title: '登录失败，请重试',
        icon: 'none',
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <View className="flex flex-col items-center justify-center min-h-screen bg-gray-50 p-6">
      <View className="mb-8">
        <Text className="block text-3xl font-bold text-blue-600 text-center mb-2">
          陕西叁恒
        </Text>
        <Text className="block text-base text-gray-500 text-center mb-2">
          企业业务管理系统
        </Text>
        <View className="bg-orange-100 rounded-lg p-3 mt-4">
          <Text className="block text-sm text-orange-600 text-center">
            🔴 当前为测试模式
          </Text>
          <Text className="block text-xs text-orange-500 text-center mt-1">
            配置微信 AppID 后可使用真实登录
          </Text>
        </View>
      </View>

      <View className="w-full max-w-sm">
        <Button
          className="w-full bg-green-500 text-white rounded-lg py-4 mb-4"
          onClick={handleLogin}
          disabled={loading}
        >
          {loading ? '登录中...' : '📱 点击登录测试'}
        </Button>

        <View className="bg-white rounded-lg p-4 shadow-sm">
          <Text className="block text-sm font-semibold text-gray-700 mb-2">
            系统功能预览
          </Text>
          <Text className="block text-xs text-gray-500 mb-1">
            ✓ 订单台账管理
          </Text>
          <Text className="block text-xs text-gray-500 mb-1">
            ✓ 业务流转（待办/接单/执行）
          </Text>
          <Text className="block text-xs text-gray-500 mb-1">
            ✓ 开票申请与审批
          </Text>
          <Text className="block text-xs text-gray-500 mb-1">
            ✓ 费用申请（居间费/工费/运费）
          </Text>
          <Text className="block text-xs text-gray-500">
            ✓ 业绩统计分析
          </Text>
        </View>

        <Text className="block text-xs text-gray-400 text-center mt-4">
          测试账号默认拥有超级管理员权限
        </Text>
      </View>
    </View>
  )
}
