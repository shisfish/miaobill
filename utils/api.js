const { get, post, put, del } = require('./request');
const { isUserLoggedIn } = require('./auth');

function getRecordsByMonth(year, month) {
  if (!isUserLoggedIn()) return Promise.reject(new Error('未登录'));
  return get(`/api/records/month/${year}/${month}`);
}

function getRecordsByRange(startDate, endDate) {
  if (!isUserLoggedIn()) return Promise.reject(new Error('未登录'));
  return get('/api/records/range', { startDate, endDate });
}

function getRecordById(id) {
  if (!isUserLoggedIn()) return Promise.reject(new Error('未登录'));
  return get(`/api/records/${id}`);
}

function createRecord(data) {
  if (!isUserLoggedIn()) return Promise.reject(new Error('未登录'));
  return post('/api/records', data);
}

function updateRecord(id, data) {
  if (!isUserLoggedIn()) return Promise.reject(new Error('未登录'));
  return put(`/api/records/${id}`, data);
}

function deleteRecord(id) {
  if (!isUserLoggedIn()) return Promise.reject(new Error('未登录'));
  return del(`/api/records/${id}`);
}

function getMonthStats(year, month) {
  if (!isUserLoggedIn()) return Promise.reject(new Error('未登录'));
  return get(`/api/records/stats/month/${year}/${month}`);
}

function getCategoryStats(year, month) {
  if (!isUserLoggedIn()) return Promise.reject(new Error('未登录'));
  return get(`/api/records/stats/category/${year}/${month}`);
}

function getCategoriesByType(type) {
  if (!isUserLoggedIn()) return Promise.reject(new Error('未登录'));
  return get(`/api/categories/type/${type}`);
}

function addCategory(data) {
  if (!isUserLoggedIn()) return Promise.reject(new Error('未登录'));
  return post('/api/categories', data);
}

function updateCategory(id, data) {
  if (!isUserLoggedIn()) return Promise.reject(new Error('未登录'));
  return put(`/api/categories/${id}`, data);
}

function deleteCategory(id) {
  if (!isUserLoggedIn()) return Promise.reject(new Error('未登录'));
  return del(`/api/categories/${id}`);
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

function doCheckin() {
  if (!isUserLoggedIn()) return Promise.reject(new Error('未登录'));
  return post('/api/checkin', {});
}

function getCheckinStats() {
  if (!isUserLoggedIn()) return Promise.reject(new Error('未登录'));
  return get('/api/checkin/stats');
}

function hasCheckedToday() {
  if (!isUserLoggedIn()) return Promise.reject(new Error('未登录'));
  return get('/api/checkin/today');
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
  updateUser,
  doCheckin,
  getCheckinStats,
  hasCheckedToday
};
