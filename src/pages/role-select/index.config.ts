export default typeof definePageConfig === 'function'
  ? definePageConfig({ navigationBarTitleText: '选择角色' })
  : { navigationBarTitleText: '选择角色' }
