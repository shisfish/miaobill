App({
  onLaunch: function () {
    this.initData();
  },
  
  onShow: function() {
    this.updateTabBar();
  },
  
  updateTabBar: function() {
    if (typeof this.getTabBar === 'function' && this.getTabBar()) {
      const pages = getCurrentPages();
      const currentPage = pages[pages.length - 1];
      const pagePath = currentPage.route;
      
      let selectedIndex = 0;
      switch(pagePath) {
        case 'pages/statistics/statistics':
          selectedIndex = 0;
          break;
        case 'pages/index/index':
          selectedIndex = 1;
          break;
        case 'pages/addRecord/addRecord':
          selectedIndex = 2;
          break;
        case 'pages/mine/mine':
          selectedIndex = 3;
          break;
      }
      
      this.getTabBar().setData({
        selected: selectedIndex
      });
    }
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