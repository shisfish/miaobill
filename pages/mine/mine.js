Page({
  data: {
    userInfo: {
      nickName: '',
      openId: ''
    },
    settings: {
      reminder: false,
      currency: '¥',
      theme: 'light'
    }
  },
  
  onLoad: function () {
    this.loadUserInfo();
    this.loadSettings();
  },
  
  // 加载用户信息
  loadUserInfo: function() {
    const userInfo = wx.getStorageSync('userInfo') || {};
    this.setData({
      userInfo: userInfo
    });
  },
  
  // 加载设置
  loadSettings: function() {
    const settings = wx.getStorageSync('settings') || {
      reminder: false,
      currency: '¥',
      theme: 'light'
    };
    this.setData({
      settings: settings
    });
  },
  
  // 登录
  login: function() {
    wx.login({
      success: (res) => {
        if (res.code) {
          // 这里可以调用后端API获取openId
          // 暂时模拟登录
          const mockUserInfo = {
            nickName: '用户' + Math.floor(Math.random() * 1000),
            openId: 'mock_openid_' + Date.now()
          };
          wx.setStorageSync('userInfo', mockUserInfo);
          this.setData({
            userInfo: mockUserInfo
          });
          wx.showToast({
            title: '登录成功',
            icon: 'success'
          });
        } else {
          wx.showToast({
            title: '登录失败',
            icon: 'none'
          });
        }
      }
    });
  },
  
  // 导出数据
  exportData: function() {
    const records = wx.getStorageSync('records') || [];
    const budgets = wx.getStorageSync('budgets') || [];
    
    const data = {
      records: records,
      budgets: budgets,
      exportTime: new Date().toISOString()
    };
    
    const dataStr = JSON.stringify(data, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    
    // 这里可以使用wx.downloadFile或其他方式导出
    wx.showToast({
      title: '数据已准备好',
      icon: 'success'
    });
    console.log('导出数据', data);
  },
  
  // 清除数据
  clearData: function() {
    wx.showModal({
      title: '清除数据',
      content: '确定要清除所有记账数据吗？此操作不可恢复。',
      success: (res) => {
        if (res.confirm) {
          wx.setStorageSync('records', []);
          wx.setStorageSync('budgets', []);
          wx.showToast({
            title: '数据已清除',
            icon: 'success'
          });
        }
      }
    });
  },
  
  // 备份数据
  backupData: function() {
    const records = wx.getStorageSync('records') || [];
    const budgets = wx.getStorageSync('budgets') || [];
    
    const backupData = {
      records: records,
      budgets: budgets,
      backupTime: new Date().toISOString()
    };
    
    wx.setStorageSync('backupData', backupData);
    wx.showToast({
      title: '数据已备份',
      icon: 'success'
    });
  },
  
  // 切换记账提醒
  onReminderChange: function(e) {
    const reminder = e.detail.value;
    const settings = this.data.settings;
    settings.reminder = reminder;
    wx.setStorageSync('settings', settings);
    this.setData({
      settings: settings
    });
  },
  
  // 选择货币单位
  selectCurrency: function() {
    const currencies = ['¥', '$', '€', '£'];
    wx.showActionSheet({
      itemList: currencies,
      success: (res) => {
        const currency = currencies[res.tapIndex];
        const settings = this.data.settings;
        settings.currency = currency;
        wx.setStorageSync('settings', settings);
        this.setData({
          settings: settings
        });
      }
    });
  },
  
  // 选择主题
  selectTheme: function() {
    const themes = ['浅色', '深色'];
    wx.showActionSheet({
      itemList: themes,
      success: (res) => {
        const theme = res.tapIndex === 0 ? 'light' : 'dark';
        const settings = this.data.settings;
        settings.theme = theme;
        wx.setStorageSync('settings', settings);
        this.setData({
          settings: settings
        });
        // 这里可以添加主题切换逻辑
        wx.showToast({
          title: '主题已切换',
          icon: 'success'
        });
      }
    });
  },
  
  // 显示关于
  showAbout: function() {
    wx.showModal({
      title: '关于鲨鱼记账',
      content: '鲨鱼记账是一个简洁易用的个人记账工具，帮助您记录日常收支并提供数据分析功能。\n\n版本：v1.0.0\n\n© 2026 鲨鱼记账',
      showCancel: false
    });
  },
  
  // 检查更新
  checkUpdate: function() {
    wx.showToast({
      title: '当前已是最新版本',
      icon: 'success'
    });
  }
})