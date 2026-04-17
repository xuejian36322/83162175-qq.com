import { View, Text, Button } from '@tarojs/components'
import Taro from '@tarojs/taro'
import { useState } from 'react'
import { Network } from '@/network'

export default function LoginPage() {
  const [loading, setLoading] = useState(false)

  const handleLogin = async () => {
    setLoading(true)

    try {
      // 获取微信登录 code
      const { code } = await Taro.login()

      // 调用后端登录接口
      const res = await Network.request({
        url: '/api/auth/wx-login',
        method: 'POST',
        data: { code },
      })

      console.log('登录响应:', res)

      if (res.data.code === 200) {
        const { token, user } = res.data.data

        // 保存 token 和用户信息
        Taro.setStorageSync('token', token)
        Taro.setStorageSync('userInfo', user)

        Taro.showToast({
          title: '登录成功',
          icon: 'success',
        })

        // 跳转到首页
        setTimeout(() => {
          Taro.switchTab({
            url: '/pages/index/index',
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
        <Text className="block text-base text-gray-500 text-center">
          企业业务管理系统
        </Text>
      </View>

      <View className="w-full max-w-sm">
        <Button
          className="w-full bg-green-500 text-white rounded-lg py-4"
          onClick={handleLogin}
          disabled={loading}
        >
          {loading ? '登录中...' : '微信一键登录'}
        </Button>

        <Text className="block text-xs text-gray-400 text-center mt-4">
          登录即表示同意《用户协议》和《隐私政策》
        </Text>
      </View>
    </View>
  )
}
