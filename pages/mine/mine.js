const { wxLogin, getUserById, doCheckin, getCheckinStats } = require('../../utils/api');
const { checkAuthAndExecute, isUserLoggedIn, performLoginWithAvatar } = require('../../utils/auth');

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

    performLoginWithAvatar(avatarUrl)
      .then(userInfo => {
        this.setData({
          nickName: userInfo.nickName,
          avatarUrl: userInfo.avatarUrl,
          userId: userInfo.id,
          isLogin: true
        });
        this.loadStats();
      })
      .catch(err => {
        if (err.message !== '用户取消登录') {
          console.error('登录失败:', err);
        }
      });
  },

  loadStats() {
    const userInfo = wx.getStorageSync('userInfo');
    if (userInfo && userInfo.id) {
      getCheckinStats()
        .then(res => {
          this.setData({
            checkinDays: res.continuousDays || 0,
            totalDays: res.totalDays || 0,
            totalRecords: res.totalRecords || 0
          });
        })
        .catch(err => {
          console.error('获取打卡统计失败:', err);
        });
    }
  },

  checkin() {
    if (this.data.checking) return;

    const today = new Date().toISOString().slice(0, 10);
    const lastCheckin = wx.getStorageSync('lastCheckinDate');
    if (lastCheckin === today) {
      wx.showToast({ title: '今日已打卡', icon: 'none' });
      return;
    }

    checkAuthAndExecute(() => {
      this.setData({ checking: true });
      wx.showLoading({ title: '打卡中...' });
      return doCheckin();
    }, {
      title: '需要登录',
      content: '请先登录以打卡'
    })
    .then(res => {
      wx.hideLoading();
      wx.setStorageSync('lastCheckinDate', today);
      this.setData({
        checkinDays: res.continuousDays || 0,
        checking: false
      });
      wx.showToast({ title: '打卡成功', icon: 'success' });
    })
    .catch(err => {
      wx.hideLoading();
      if (err.message !== '用户取消登录') {
        console.error('打卡失败:', err);
        this.setData({ checking: false });
        wx.showToast({ title: '打卡失败，请重试', icon: 'none' });
      } else {
        this.setData({ checking: false });
      }
    });
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
