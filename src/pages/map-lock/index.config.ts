export default typeof definePageConfig === 'function'
  ? definePageConfig({ navigationBarTitleText: '地图标点' })
  : { navigationBarTitleText: '地图标点' }
