const { baseUrl } = require('./config');

function buildUrl(url, params) {
  if (!params) return url;
  const query = Object.keys(params)
    .filter(k => params[k] !== null && params[k] !== undefined)
    .map(k => `${encodeURIComponent(k)}=${encodeURIComponent(params[k])}`)
    .join('&');
  return query ? `${url}?${query}` : url;
}

function request(options) {
  const { url, method = 'GET', data = {}, params = {}, header = {} } = options;

  const fullUrl = `${baseUrl}${buildUrl(url, params)}`;

  const userInfo = wx.getStorageSync('userInfo');
  const token = userInfo ? userInfo.token : '';

  return new Promise((resolve, reject) => {
    wx.request({
      url: fullUrl,
      method,
      data,
      header: {
        'Content-Type': 'application/json',
        'Authorization': token,
        ...header
      },
      success: (res) => {
        if (res.statusCode === 200) {
          if (res.data.code === 200) {
            resolve(res.data.data);
          } else {
            wx.showToast({ title: res.data.message || '请求失败', icon: 'none' });
            reject(res.data);
          }
        } else if (res.statusCode === 401) {
          wx.removeStorageSync('userInfo');
          wx.showToast({ title: '请重新登录', icon: 'none' });
          reject(res);
        } else {
          wx.showToast({ title: '请求失败', icon: 'none' });
          reject(res);
        }
      },
      fail: (err) => {
        console.error('网络请求失败:', fullUrl, err);
        wx.showToast({ title: '网络请求失败', icon: 'none' });
        reject(err);
      }
    });
  });
}

function get(url, params) {
  return request({ url, method: 'GET', params });
}

function post(url, data, params) {
  return request({ url, method: 'POST', data, params });
}

function put(url, data, params) {
  return request({ url, method: 'PUT', data, params });
}

function del(url) {
  return request({ url, method: 'DELETE' });
}

module.exports = {
  request,
  get,
  post,
  put,
  del
};
