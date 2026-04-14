Page({
  data: {
    userInfo: {
      nickName: '',
      openId: ''
    },
    checkinDays: 0,
    totalDays: 0,
    totalRecords: 0,
    hasCheckedToday: false,
    showBadge: true,
    settings: {
      reminder: false,
      currency: '¥',
      theme: 'light'
    }
  },
  
  onLoad: function () {
    this.loadUserInfo();
    this.loadSettings();
    this.updateStats();
    this.checkTodayCheckin();
  },
  
  onShow: function() {
    this.updateStats();
    this.checkTodayCheckin();
  },
  
  loadUserInfo: function() {
    const userInfo = wx.getStorageSync('userInfo') || {};
    this.setData({
      userInfo: userInfo
    });
  },
  
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
  
  updateStats: function() {
    const records = wx.getStorageSync('records') || [];
    const checkinData = wx.getStorageSync('checkinData') || {
      lastCheckin: '',
      checkinDays: 0,
      totalCheckins: 0
    };
    
    const totalRecords = records.length;
    
    const dates = new Set();
    records.forEach(record => dates.add(record.date));
    const totalDays = dates.size;
    
    const today = new Date().toISOString().split('T')[0];
    let checkinDays = checkinData.checkinDays;
    
    if (checkinData.lastCheckin !== today) {
      const lastDate = new Date(checkinData.lastCheckin);
      const todayDate = new Date(today);
      const diffTime = Math.abs(todayDate - lastDate);
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      
      if (diffDays === 1) {
        checkinDays += 1;
      } else if (diffDays > 1) {
        checkinDays = 0;
      }
    }
    
    this.setData({
      checkinDays: checkinDays,
      totalDays: totalDays,
      totalRecords: totalRecords
    });
  },
  
  checkTodayCheckin: function() {
    const today = new Date().toISOString().split('T')[0];
    const checkinData = wx.getStorageSync('checkinData') || {};
    this.setData({
      hasCheckedToday: checkinData.lastCheckin === today
    });
  },
  
  login: function() {
    wx.login({
      success: (res) => {
        if (res.code) {
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
  
  checkin: function() {
    const today = new Date().toISOString().split('T')[0];
    const checkinData = wx.getStorageSync('checkinData') || {
      lastCheckin: '',
      checkinDays: 0,
      totalCheckins: 0
    };
    
    if (checkinData.lastCheckin !== today) {
      const lastDate = new Date(checkinData.lastCheckin);
      const todayDate = new Date(today);
      const diffTime = Math.abs(todayDate - lastDate);
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      
      let checkinDays = checkinData.checkinDays;
      if (diffDays === 1) {
        checkinDays += 1;
      } else if (diffDays > 1) {
        checkinDays = 0;
      } else if (diffDays === 0) {
        checkinDays = checkinData.checkinDays;
      } else {
        checkinDays = 1;
      }
      
      const newCheckinData = {
        lastCheckin: today,
        checkinDays: checkinDays,
        totalCheckins: checkinData.totalCheckins + 1
      };
      
      wx.setStorageSync('checkinData', newCheckinData);
      this.setData({
        checkinDays: checkinDays,
        hasCheckedToday: true
      });
      
      wx.showToast({
        title: '打卡成功',
        icon: 'success'
      });
    } else {
      wx.showToast({
        title: '今日已打卡',
        icon: 'none'
      });
    }
  },
  
  upgradeVIP: function() {
    wx.showModal({
      title: '升级VIP',
      content: '升级为VIP可享受更多高级功能，如数据导出、多账本管理等。',
      showCancel: true,
      confirmText: '立即升级',
      cancelText: '取消',
      success: (res) => {
        if (res.confirm) {
          wx.showToast({
            title: '功能开发中',
            icon: 'none'
          });
        }
      }
    });
  },
  
  showNotifications: function() {
    wx.showToast({
      title: '暂无消息',
      icon: 'none'
    });
  },
  
  showBadges: function() {
    wx.showToast({
      title: '功能开发中',
      icon: 'none'
    });
  },
  
  showPoints: function() {
    wx.showToast({
      title: '功能开发中',
      icon: 'none'
    });
  },
  
  showSettings: function() {
    wx.showToast({
      title: '功能开发中',
      icon: 'none'
    });
  },
  
  showMyBooks: function() {
    wx.showToast({
      title: '功能开发中',
      icon: 'none'
    });
  },
  
  showFamilyBill: function() {
    wx.showToast({
      title: '功能开发中',
      icon: 'none'
    });
  },
  
  showSecurity: function() {
    wx.showToast({
      title: '功能开发中',
      icon: 'none'
    });
  },
  
  showFeedback: function() {
    wx.showToast({
      title: '功能开发中',
      icon: 'none'
    });
  },
  
  rateApp: function() {
    wx.showToast({
      title: '感谢您的支持！',
      icon: 'success'
    });
  },
  
  showAbout: function() {
    wx.showModal({
      title: '关于杪记',
      content: '杪记是一个简洁易用的个人记账工具，帮助您记录日常收支并提供数据分析功能。\n\n版本：v1.0.0\n\n© 2026 杪记',
      showCancel: false
    });
  }
})