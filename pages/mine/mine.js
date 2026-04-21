const { wxLogin, getUserById } = require('../../utils/api');

Page({
  data: {
    nickName: '',
    avatarUrl: '',
    userId: null,
    checkinDays: 0,
    totalDays: 0,
    totalRecords: 0,
    checking: false,
    isLogin: false
  },

  onLoad() {
    this.loadUserInfo();
    this.loadStats();
  },
  onShow() {
    this.loadStats();
  },

  loadUserInfo() {
    const userInfo = wx.getStorageSync('userInfo');
    if (userInfo && userInfo.id) {
      this.setData({
        nickName: userInfo.nickName || '',
        avatarUrl: userInfo.avatarUrl || '',
        userId: userInfo.id,
        isLogin: true
      });
      this.loadUserDataFromServer(userInfo.id);
    }
  },

  loadUserDataFromServer(userId) {
    getUserById(userId)
      .then(user => {
        if (user) {
          this.setData({
            nickName: user.nickName || '',
            avatarUrl: user.avatarUrl || '',
            userId: user.id,
            isLogin: true
          });
          wx.setStorageSync('userInfo', {
            id: user.id,
            nickName: user.nickName,
            avatarUrl: user.avatarUrl
          });
        }
      })
      .catch(err => {
        console.error('获取用户数据失败:', err);
      });
  },

  onChooseAvatar(e) {
    const avatarUrl = e.detail.avatarUrl;
    if (!avatarUrl) return;

    wx.showLoading({ title: '登录中...' });
    wx.login({
      success: (res) => {
        if (res.code) {
          this.sendLoginToServer(res.code, '', avatarUrl, 0);
        } else {
          wx.hideLoading();
          wx.showToast({ title: '登录失败', icon: 'none' });
        }
      },
      fail: () => {
        wx.hideLoading();
        wx.showToast({ title: '登录失败', icon: 'none' });
      }
    });
  },

  sendLoginToServer(code, nickName, avatarUrl, gender) {
    wxLogin({ code, nickName, avatarUrl, gender })
      .then(res => {
        wx.hideLoading();
        const userInfo = {
          id: res.id,
          nickName: res.nickName,
          avatarUrl: res.avatarUrl
        };
        wx.setStorageSync('userInfo', userInfo);
        this.setData({
          nickName: res.nickName,
          avatarUrl: res.avatarUrl,
          userId: res.id,
          isLogin: true
        });
        wx.showToast({ title: '登录成功', icon: 'success' });
      })
      .catch(err => {
        wx.hideLoading();
        console.error('登录失败:', err);
        wx.showToast({ title: '登录失败，请重试', icon: 'none' });
      });
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
    if (this.data.checking) return;
    const today = new Date().toISOString().slice(0, 10);
    const lastCheckin = wx.getStorageSync('lastCheckinDate');
    if (lastCheckin === today) {
      wx.showToast({ title: '今日已打卡', icon: 'none' });
      return;
    }
    this.setData({ checking: true });
    let d = this.data.checkinDays + 1;
    wx.setStorageSync('checkinDays', d);
    wx.setStorageSync('lastCheckinDate', today);
    this.setData({ checkinDays: d, checking: false });
    wx.showToast({ title: '打卡成功', icon: 'success' });
  },

  upgradeVip() { wx.showToast({ title: '功能开发中', icon: 'none' }); },

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
      title: '关于杪记',
      content: '杪记 V1.0.0\n\n用心记录每一笔',
      showCancel: false
    });
  },

  addRecord() {
    wx.switchTab({ url: '/pages/addRecord/addRecord' });
  },

  onUnload() {
  }
});
