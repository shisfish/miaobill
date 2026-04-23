const { wxLogin } = require('./api');

function isUserLoggedIn() {
  const userInfo = wx.getStorageSync('userInfo');
  return !!(userInfo && userInfo.id);
}

function getCurrentUserId() {
  const userInfo = wx.getStorageSync('userInfo');
  return userInfo ? userInfo.id : null;
}

function performLoginWithAvatar(avatarUrl) {
  return new Promise((resolve, reject) => {
    wx.showLoading({ title: '登录中...' });
    wx.login({
      success: (loginRes) => {
        if (loginRes.code) {
          sendLoginToServer(loginRes.code, '', avatarUrl, 0)
            .then(userInfo => {
              wx.hideLoading();
              resolve(userInfo);
            })
            .catch(err => {
              wx.hideLoading();
              reject(err);
            });
        } else {
          wx.hideLoading();
          reject(new Error('登录失败'));
        }
      },
      fail: (err) => {
        wx.hideLoading();
        reject(err);
      }
    });
  });
}

function sendLoginToServer(code, nickName, avatarUrl, gender) {
  return wxLogin({ code, nickName, avatarUrl, gender })
    .then(res => {
      const userInfo = {
        id: res.id,
        nickName: res.nickName,
        avatarUrl: res.avatarUrl,
        token: res.token
      };
      wx.setStorageSync('userInfo', userInfo);
      wx.showToast({ title: '登录成功', icon: 'success' });
      return userInfo;
    })
    .catch(err => {
      console.error('登录失败:', err);
      wx.showToast({ title: '登录失败，请重试', icon: 'none' });
      throw err;
    });
}

module.exports = {
  isUserLoggedIn,
  getCurrentUserId,
  performLoginWithAvatar
};
