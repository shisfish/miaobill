App({
  onLaunch: function () {
    // 初始化数据
    this.initData();
  },
  
  initData: function() {
    // 检查是否有记账数据
    const records = wx.getStorageSync('records');
    if (!records) {
      wx.setStorageSync('records', []);
    }
    
    // 检查是否有预算数据
    const budgets = wx.getStorageSync('budgets');
    if (!budgets) {
      wx.setStorageSync('budgets', []);
    }
  },
  
  globalData: {
    userInfo: null
  }
})