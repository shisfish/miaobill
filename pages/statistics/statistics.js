const { getRecordsByMonth } = require('../../utils/api');
const { getCategoryIcon } = require('../../utils/categories');
const { isUserLoggedIn, performLoginWithAvatar } = require('../../utils/auth');

Page({
  data: {
    timeFilter: 'all',
    filteredRecords: [],
    groupedRecords: [],
    monthExpense: '0.00',
    currentYear: 2026,
    currentMonth: 4,
    monthValue: '2026-04',
    showMonthPicker: false,
    showLoginConfirm: false
  },

  onLoad: function () {
    const now = new Date();
    this.setData({
      currentYear: now.getFullYear(),
      currentMonth: now.getMonth() + 1,
      monthValue: `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`
    });
    this.loadRecords();
  },

  onShow: function() {
    this.loadRecords();
  },
  
  loadRecords: function() {
    if (!isUserLoggedIn()) {
      this.setData({
        filteredRecords: [],
        groupedRecords: [],
        monthExpense: '0.00'
      });
      return;
    }

    const { currentYear, currentMonth } = this.data;

    getRecordsByMonth(currentYear, currentMonth)
      .then(records => {
        const filteredRecords = records.map(record => ({
          id: record.id,
          date: record.date,
          time: record.createTime ? record.createTime.substring(11, 16) : '',
          category: record.category,
          amount: parseFloat(record.amount).toFixed(2),
          type: record.type === 'expense' ? 2 : 1,
          remark: record.description
        })).sort((a, b) => new Date(b.date) - new Date(a.date));

        const groupedRecords = this.groupRecordsByDate(filteredRecords);
        const monthStats = this.calculateMonthStats(filteredRecords, currentYear, currentMonth);

        this.setData({
          filteredRecords: filteredRecords,
          groupedRecords: groupedRecords,
          monthExpense: monthStats.expense
        });
      })
      .catch(err => {
        console.error('获取记录失败:', err);
      });
  },
  
  setTimeFilter: function(e) {
    const filter = e.currentTarget.dataset.filter;
    this.setData({
      timeFilter: filter
    });
    this.loadRecords();
  },
  
  filterRecords: function(records) {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    let filtered = [...records];
    
    switch (this.data.timeFilter) {
      case 'today':
        const todayStr = today.toISOString().split('T')[0];
        filtered = records.filter(r => r.date === todayStr);
        break;
      case 'week':
        const weekStart = new Date(today);
        weekStart.setDate(today.getDate() - today.getDay());
        weekStart.setHours(0, 0, 0, 0);
        filtered = records.filter(r => new Date(r.date) >= weekStart);
        break;
      case 'month':
        const monthStart = new Date(today.getFullYear(), today.getMonth(), 1);
        filtered = records.filter(r => new Date(r.date) >= monthStart);
        break;
    }
    
    return filtered.sort((a, b) => {
      const dateA = new Date(a.date + ' ' + a.time);
      const dateB = new Date(b.date + ' ' + b.time);
      return dateB - dateA;
    });
  },
  
  groupRecordsByDate: function(records) {
    const groups = {};

    records.forEach(record => {
      if (!groups[record.date]) {
        groups[record.date] = [];
      }
      record.categoryIcon = getCategoryIcon(record.category);
      groups[record.date].push(record);
    });

    const result = Object.keys(groups).sort((a, b) => new Date(b) - new Date(a)).map(date => {
      const dateObj = new Date(date);
      const month = (dateObj.getMonth() + 1).toString().padStart(2, '0');
      const day = dateObj.getDate().toString().padStart(2, '0');
      const weekdays = ['星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六'];
      const weekday = weekdays[dateObj.getDay()];

      let dayExpense = 0;
      groups[date].forEach(r => {
        if (r.type === 2) {
          dayExpense += parseFloat(r.amount);
        }
      });

      // 格式化金额，去掉多余的0
      const formattedExpense = parseFloat(dayExpense.toFixed(2)).toString();

      return {
        date: date,
        dateText: `${month}月${day}日 ${weekday}`,
        records: groups[date],
        dayExpense: formattedExpense
      };
    });

    return result;
  },
  
  calculateMonthStats: function(records, year, month) {
    let expense = 0;

    records.forEach(record => {
      const recordDate = new Date(record.date);
      if (recordDate.getFullYear() === year && recordDate.getMonth() + 1 === month) {
        expense += parseFloat(record.amount);
      }
    });

    return {
      expense: expense.toFixed(2)
    };
  },

  onMonthChange: function() {},

  showMonthPicker: function() {
    this.setData({
      showMonthPicker: true
    });
  },

  onMonthConfirm: function(e) {
    const { year, month } = e.detail;
    this.setData({
      currentYear: year,
      currentMonth: month,
      monthValue: `${year}-${String(month).padStart(2, '0')}`,
      showMonthPicker: false
    }, () => {
      this.loadRecords();
    });
  },

  onMonthCancel: function() {
    this.setData({
      showMonthPicker: false
    });
  },
  
  viewRecord: function(e) {
    const id = e.currentTarget.dataset.id;
    wx.showToast({
      title: '查看详情功能开发中',
      icon: 'none'
    });
  },

  addRecord: function() {
    if (!isUserLoggedIn()) {
      this.setData({ showLoginConfirm: true });
    } else {
      wx.switchTab({
        url: '/pages/addRecord/addRecord'
      });
    }
  },

  onChooseAvatar: function(e) {
    const avatarUrl = e.detail && e.detail.avatarUrl;
    if (!avatarUrl) {
      console.log('未选择头像或取消选择');
      return;
    }

    performLoginWithAvatar(avatarUrl)
      .then(userInfo => {
        this.setData({ showLoginConfirm: false });
        this.loadRecords();
        wx.switchTab({ url: '/pages/addRecord/addRecord' });
      })
      .catch(err => {
        if (err.message !== '用户取消登录') {
          console.error('登录失败:', err);
        }
      });
  },

  onLoginCancel: function() {
    this.setData({ showLoginConfirm: false });
  },

  onUnload: function() {
    // 清理资源
  }
})