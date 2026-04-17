import { useState, useEffect } from 'react'
import Taro from '@tarojs/taro'
import { View, Text, ScrollView } from '@tarojs/components'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Network } from '@/network'
import { Plus, Pencil, Trash2, Search } from 'lucide-react-taro'
import { canManageUsers, UserRole, getRoleDisplayName } from '@/utils/permission'

// 新角色配置（8个角色）
const ROLE_OPTIONS = [
  { value: UserRole.SUPER_ADMIN, name: getRoleDisplayName(UserRole.SUPER_ADMIN), color: '#dc2626' },
  { value: UserRole.TESTING_MANAGER, name: getRoleDisplayName(UserRole.TESTING_MANAGER), color: '#059669' },
  { value: UserRole.ENGINEERING_MANAGER, name: getRoleDisplayName(UserRole.ENGINEERING_MANAGER), color: '#0891b2' },
  { value: UserRole.FINANCE, name: getRoleDisplayName(UserRole.FINANCE), color: '#ea580c' },
  { value: UserRole.BUSINESS_MANAGER, name: getRoleDisplayName(UserRole.BUSINESS_MANAGER), color: '#2563eb' },
  { value: UserRole.TESTING_WORKER, name: getRoleDisplayName(UserRole.TESTING_WORKER), color: '#10b981' },
  { value: UserRole.INSTALLATION_WORKER, name: getRoleDisplayName(UserRole.INSTALLATION_WORKER), color: '#f59e0b' },
  { value: UserRole.CERTIFICATE_MAKER, name: getRoleDisplayName(UserRole.CERTIFICATE_MAKER), color: '#7c3aed' },
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

  const getRoleNames = (roles: string[] | string): string[] => {
    const roleList = Array.isArray(roles) ? roles : roles ? [roles] : []
    return roleList.map((role) => {
      const roleOption = ROLE_OPTIONS.find((r) => r.value === role)
      return roleOption ? roleOption.name : role
    })
  }

  const getCompanyName = (company: string): string => {
    const companyOption = COMPANY_OPTIONS.find((c) => c.value === company)
    return companyOption ? companyOption.name : company
  }

  const filteredUsers = users.filter((user) => {
    if (!searchKeyword) return true
    const keyword = searchKeyword.toLowerCase()
    return (
      user.name.toLowerCase().includes(keyword) ||
      (user.phone && user.phone.includes(keyword))
    )
  })

  return (
    <View className="min-h-screen bg-gray-50">
      {/* 顶部标题 */}
      <View className="bg-gradient-to-r from-blue-500 to-blue-600 px-4 py-6">
        <View className="flex items-center justify-between">
          <Text className="block text-xl font-bold text-white">用户管理</Text>
          <Button
            size="sm"
            variant="ghost"
            onClick={handleAddUser}
            className="text-white border-white opacity-50"
          >
            <Plus size={18} color="#ffffff" />
            <Text className="ml-2 text-white">新增用户</Text>
          </Button>
        </View>
      </View>

      {/* 搜索框 */}
      <View className="p-4 bg-white border-b border-gray-200">
        <View className="bg-gray-100 rounded-xl px-4 py-3 flex items-center gap-3">
          <Search size={16} color="#9ca3af" />
          <Input
            className="flex-1 bg-transparent"
            placeholder="搜索用户姓名或手机号"
            value={searchKeyword}
            onInput={(e) => setSearchKeyword(e.detail.value)}
          />
        </View>
      </View>

      {/* 用户列表 */}
      <ScrollView scrollY className="flex-1 p-4 pb-8">
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
            {filteredUsers.map((user) => {
              const roleNames = getRoleNames(user.roles)
              const companyName = getCompanyName(user.company)

              return (
                <Card key={user.id}>
                  <CardContent className="p-4">
                    <View className="flex items-start justify-between mb-3">
                      <View className="flex-1">
                        <Text className="block font-semibold text-gray-900 mb-1">
                          {user.name}
                        </Text>
                        {user.phone && (
                          <Text className="block text-sm text-gray-500">
                            {user.phone}
                          </Text>
                        )}
                      </View>
                      <View className="flex gap-2">
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => handleEditUser(user.id)}
                        >
                          <Pencil size={14} color="#3b82f6" />
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => handleDeleteUser(user.id, user.name)}
                        >
                          <Trash2 size={14} color="#ef4444" />
                        </Button>
                      </View>
                    </View>

                    {/* 角色标签 */}
                    <View className="flex flex-wrap gap-2 mb-2">
                      {roleNames.map((roleName, index) => (
                        <Badge
                          key={index}
                          className="text-xs px-2 py-1"
                          style={{
                            backgroundColor: '#e5e7eb',
                            color: '#374151',
                          }}
                        >
                          {roleName}
                        </Badge>
                      ))}
                    </View>

                    {/* 公司标签 */}
                    <View>
                      <Badge
                        className="text-xs px-2 py-1"
                        style={{
                          backgroundColor: '#dbeafe',
                          color: '#1e40af',
                        }}
                      >
                        {companyName}
                      </Badge>
                    </View>
                  </CardContent>
                </Card>
              )
            })}
          </View>
        )}
      </ScrollView>
    </View>
  )
}
