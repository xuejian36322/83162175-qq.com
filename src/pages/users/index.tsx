import { useState, useEffect } from 'react'
import Taro from '@tarojs/taro'
import { View, Text } from '@tarojs/components'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Network } from '@/network'
import { Plus, Pencil, Trash2, Search } from 'lucide-react-taro'
import { canManageUsers } from '@/utils/permission'

// 角色配置
const ROLE_OPTIONS = [
  { value: 'company_admin', name: '公司管理员' },
  { value: 'finance', name: '财务' },
  { value: 'engineering_director', name: '工程部负责人' },
  { value: 'testing_director', name: '检测部负责人' },
  { value: 'certificate_manager', name: '检测证书管理员' },
  { value: 'business_assistant', name: '业务助理' },
  { value: 'engineering_business_1', name: '工程公司业务1部' },
  { value: 'engineering_business_2', name: '工程公司业务2部' },
  { value: 'metrology_business_1', name: '计量公司业务1部' },
  { value: 'installer', name: '安装工' },
  { value: 'tester', name: '检测员' },
]

const COMPANY_OPTIONS = [
  { value: 'sanheng_jiliang', name: '叁恒计量' },
  { value: 'sanheng_zhian', name: '叁恒智安' },
]

export default function UsersPage() {
  const [users, setUsers] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const [searchKeyword, setSearchKeyword] = useState('')

  useEffect(() => {
    // 检查权限
    if (!canManageUsers()) {
      Taro.showToast({
        title: '无权访问',
        icon: 'none',
      })
      setTimeout(() => {
        Taro.navigateBack()
      }, 1500)
      return
    }

    loadUsers()
  }, [])

  const loadUsers = async () => {
    setLoading(true)
    try {
      const res = await Network.request({
        url: '/api/users',
        method: 'GET',
      })

      console.log('用户列表响应:', res)

      if (res.data.code === 200) {
        setUsers(res.data.data || [])
      }
    } catch (error) {
      console.error('获取用户列表失败:', error)
      Taro.showToast({
        title: '加载失败',
        icon: 'none',
      })
    } finally {
      setLoading(false)
    }
  }

  const handleAddUser = () => {
    Taro.navigateTo({
      url: '/pages/users/edit?mode=add',
    })
  }

  const handleEditUser = (userId: string) => {
    Taro.navigateTo({
      url: `/pages/users/edit?mode=edit&id=${userId}`,
    })
  }

  const handleDeleteUser = (userId: string, userName: string) => {
    Taro.showModal({
      title: '确认删除',
      content: `确定要删除用户"${userName}"吗？`,
      success: async (res) => {
        if (res.confirm) {
          try {
            const deleteRes = await Network.request({
              url: `/api/users/${userId}`,
              method: 'DELETE',
            })

            if (deleteRes.data.code === 200) {
              Taro.showToast({
                title: '删除成功',
                icon: 'success',
              })
              loadUsers()
            } else {
              Taro.showToast({
                title: deleteRes.data.msg || '删除失败',
                icon: 'none',
              })
            }
          } catch (error) {
            console.error('删除用户失败:', error)
            Taro.showToast({
              title: '删除失败',
              icon: 'none',
            })
          }
        }
      },
    })
  }

  const getRoleName = (role: string) => {
    const roleOption = ROLE_OPTIONS.find(r => r.value === role)
    return roleOption?.name || role
  }

  const getCompanyName = (company: string) => {
    const companyOption = COMPANY_OPTIONS.find(c => c.value === company)
    return companyOption?.name || company
  }

  const filteredUsers = users.filter(user =>
    user.name.toLowerCase().includes(searchKeyword.toLowerCase()) ||
    user.phone?.includes(searchKeyword)
  )

  return (
    <View className="min-h-screen bg-gray-50">
      {/* 顶部搜索栏 */}
      <View className="bg-white p-4">
        <View className="bg-gray-50 rounded-xl px-4 py-3">
          <View className="flex items-center gap-2">
            <Search size={18} color="#9ca3af" />
            <Input
              className="flex-1 bg-transparent"
              placeholder="搜索用户姓名或手机号..."
              value={searchKeyword}
              onInput={(e) => setSearchKeyword(e.detail.value)}
            />
          </View>
        </View>
      </View>

      {/* 添加按钮 */}
      <View className="px-4 py-4">
        <Button
          className="w-full bg-blue-500 text-white"
          onClick={handleAddUser}
        >
          <Plus size={18} color="#ffffff" />
          <Text className="ml-2">添加用户</Text>
        </Button>
      </View>

      {/* 用户列表 */}
      <View className="px-4 pb-8">
        {loading ? (
          <View className="py-8 text-center">
            <Text className="block text-gray-400">加载中...</Text>
          </View>
        ) : filteredUsers.length === 0 ? (
          <View className="py-8 text-center">
            <Text className="block text-gray-400">暂无用户</Text>
          </View>
        ) : (
          <View className="space-y-3">
            {filteredUsers.map((user) => (
              <Card key={user.id}>
                <CardContent className="p-4">
                  <View className="flex items-center justify-between">
                    <View className="flex-1">
                      <View className="flex items-center gap-2 mb-2">
                        <Text className="block font-semibold text-gray-900">
                          {user.name}
                        </Text>
                        {user.is_active ? (
                          <Badge variant="default" className="text-xs">正常</Badge>
                        ) : (
                          <Badge variant="secondary" className="text-xs">禁用</Badge>
                        )}
                      </View>
                      <Text className="block text-sm text-gray-500 mb-1">
                        {user.phone || '未填写手机号'}
                      </Text>
                      <View className="flex items-center gap-2">
                        <Text className="text-xs text-gray-500">
                          {getRoleName(user.role)}
                        </Text>
                        <Text className="text-xs text-gray-300">|</Text>
                        <Text className="text-xs text-gray-500">
                          {getCompanyName(user.company)}
                        </Text>
                      </View>
                    </View>
                    <View className="flex items-center gap-2 ml-4">
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => handleEditUser(user.id)}
                      >
                        <Pencil size={18} color="#1890ff" />
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => handleDeleteUser(user.id, user.name)}
                      >
                        <Trash2 size={18} color="#ef4444" />
                      </Button>
                    </View>
                  </View>
                </CardContent>
              </Card>
            ))}
          </View>
        )}
      </View>
    </View>
  )
}
