Page({
  data: {
    timeFilter: 'all',
    filteredRecords: [],
    groupedRecords: [],
    monthIncome: 0,
    monthExpense: 0,
    monthBalance: 0
  },
  
  onLoad: function () {
    this.loadRecords();
  },
  
  onShow: function() {
    this.loadRecords();
  },
  
  loadRecords: function() {
    const records = wx.getStorageSync('records') || [];
    const filteredRecords = this.filterRecords(records);
    const groupedRecords = this.groupRecordsByDate(filteredRecords);
    const monthStats = this.calculateMonthStats(records);
    
    this.setData({
      filteredRecords: filteredRecords,
      groupedRecords: groupedRecords,
      monthIncome: monthStats.income,
      monthExpense: monthStats.expense,
      monthBalance: monthStats.balance
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
        groups[record.date].push(record);
    });
    
    const result = Object.keys(groups).sort((a, b) => new Date(b) - new Date(a)).map(date => {
      const dateObj = new Date(date);
      const month = dateObj.getMonth() + 1;
      const day = dateObj.getDate();
      const weekdays = ['周日', '周一', '周二', '周三', '周四', '周五', '周六'];
      const weekday = weekdays[dateObj.getDay()];
      
      let dayBalance = 0;
      groups[date].forEach(r => {
        if (r.type === 1) {
          dayBalance += parseFloat(r.amount);
        } else {
          dayBalance -= parseFloat(r.amount);
        }
      });
      
      return {
        date: date,
        dateText: `${month}月${day}日 ${weekday}`,
        records: groups[date],
        dayBalance: dayBalance.toFixed(2)
      };
    });
    
    return result;
  },
  
  calculateMonthStats: function(records) {
    const today = new Date();
    const monthStart = new Date(today.getFullYear(), today.getMonth(), 1);
    
    let income = 0;
    let expense = 0;
    
    records.forEach(record => {
      const recordDate = new Date(record.date);
      if (recordDate >= monthStart) {
        if (record.type === 1) {
          income += parseFloat(record.amount);
        } else {
          expense += parseFloat(record.amount);
        }
      }
    });
    
    return {
      income: income.toFixed(2),
      expense: expense.toFixed(2),
      balance: (income - expense).toFixed(2)
    };
  },
  
  getCategoryIcon: function(category) {
    const icons = {
      '餐饮': '🍽️',
      '交通': '🚗',
      '购物': '🛍️',
      '娱乐': '🎮',
      '医疗': '🏥',
      '教育': '📚',
      '居住': '🏠',
      '通讯': '📱',
      '工资': '💼',
      '奖金': '🎁',
      '投资': '📈',
      '兼职': '💻',
      '其他': '📦'
    };
    return icons[category] || '📦';
  },
  
  viewRecord: function(e) {
    const id = e.currentTarget.dataset.id;
    wx.showToast({
      title: '查看详情功能开发中',
      icon: 'none'
    });
  }
})