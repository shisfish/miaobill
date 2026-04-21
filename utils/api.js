const { get, post, put, del } = require('./request');

function getUserId() {
  const userInfo = wx.getStorageSync('userInfo');
  return userInfo ? userInfo.id : null;
}

function getRecordsByMonth(year, month) {
  return get(`/api/records/month/${year}/${month}`, { userId: getUserId() });
}

function getRecordsByRange(startDate, endDate) {
  return get('/api/records/range', { userId: getUserId(), startDate, endDate });
}

function getRecordById(id) {
  return get(`/api/records/${id}`, { userId: getUserId() });
}

function createRecord(data) {
  return post('/api/records', data, { userId: getUserId() });
}

function updateRecord(id, data) {
  return put(`/api/records/${id}`, data, { userId: getUserId() });
}

function deleteRecord(id) {
  return del(`/api/records/${id}?userId=${getUserId()}`);
}

function getMonthStats(year, month) {
  return get(`/api/records/stats/month/${year}/${month}`, { userId: getUserId() });
}

function getCategoryStats(year, month) {
  return get(`/api/records/stats/category/${year}/${month}`, { userId: getUserId() });
}

function getCategoriesByType(type) {
  return get(`/api/categories/type/${type}`, { userId: getUserId() });
}

function addCategory(data) {
  return post('/api/categories', data, { userId: getUserId() });
}

function updateCategory(id, data) {
  return put(`/api/categories/${id}`, data, { userId: getUserId() });
}

function deleteCategory(id) {
  return del(`/api/categories/${id}?userId=${getUserId()}`);
}

function wxLogin(data) {
  return post('/api/user/login', data);
}

function getUserById(id) {
  return get(`/api/user/${id}`);
}

function updateUser(id, data) {
  return put(`/api/user/${id}`, data);
}

module.exports = {
  getRecordsByMonth,
  getRecordsByRange,
  getRecordById,
  createRecord,
  updateRecord,
  deleteRecord,
  getMonthStats,
  getCategoryStats,
  getCategoriesByType,
  addCategory,
  updateCategory,
  deleteCategory,
  wxLogin,
  getUserById,
  updateUser
};
