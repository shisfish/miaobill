App({
  onLaunch: function () {
    this.initData();
  },
  
  onShow: function() {
  },
  
  initData: function() {
    const records = wx.getStorageSync('records');
    if (!records) {
      wx.setStorageSync('records', []);
    }
    
    const budgets = wx.getStorageSync('budgets');
    if (!budgets) {
      wx.setStorageSync('budgets', []);
    }
  },
  
  globalData: {
    userInfo: null
  }
})