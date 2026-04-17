export default typeof definePageConfig === 'function'
  ? definePageConfig({ navigationBarTitleText: '我的任务' })
  : { navigationBarTitleText: '我的任务' }
