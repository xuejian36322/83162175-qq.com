export default typeof definePageConfig === 'function'
  ? definePageConfig({ navigationBarTitleText: '订单执行' })
  : { navigationBarTitleText: '订单执行' }
