Page({
  data: {
    nickName: '鱼悦鲸',
    avatarUrl: '',
    checkinDays: 0,
    totalDays: 0,
    totalRecords: 0
  },

  onLoad() {
    this.loadStats();
  },
  onShow() {
    this.loadStats();
  },

  loadStats() {
    const records = wx.getStorageSync('records') || [];
    const dates = new Set(records.map(r => r.date));
    this.setData({
      totalRecords: records.length,
      totalDays: dates.size,
      checkinDays: wx.getStorageSync('checkinDays') || 0
    });
  },

  checkin() {
    let d = this.data.checkinDays + 1;
    wx.setStorageSync('checkinDays', d);
    this.setData({ checkinDays: d });
    wx.showToast({ title: '打卡成功', icon: 'success' });
  },

  upgradeVip() { wx.showToast({ title: '功能开发中', icon: 'none' }); },

  // 功能入口
  goMsg() { wx.showToast({ title: '暂无消息', icon: 'none' }); },
  goBadge() { wx.showToast({ title: '功能开发中', icon: 'none' }); },
  goPoints() { wx.showToast({ title: '功能开发中', icon: 'none' }); },
  goSettings() { wx.showToast({ title: '功能开发中', icon: 'none' }); },
  goBooks() { wx.showToast({ title: '功能开发中', icon: 'none' }); },
  goFamily() { wx.showToast({ title: '功能开发中', icon: 'none' }); },
  goSettings2() { wx.showToast({ title: '功能开发中', icon: 'none' }); },
  goSecurity() { wx.showToast({ title: '功能开发中', icon: 'none' }); },
  goFeedback() { wx.showToast({ title: '功能开发中', icon: 'none' }); },
  goRate() { wx.showToast({ title: '感谢支持！', icon: 'success' }); },
  goAbout() {
    wx.showModal({
      title: '关于鲨鱼记账',
      content: '鲨鱼记账 V5.59.0\n\n用心记录每一笔',
      showCancel: false
    });
  },

  addRecord() {
    wx.switchTab({ url: '/pages/addRecord/addRecord' });
  },

  onUnload() {
    // 清理资源
  }
});
