export default typeof definePageConfig === 'function'
  ? definePageConfig({
      navigationBarTitleText: '订单录入',
    })
  : {
      navigationBarTitleText: '订单录入',
    }
