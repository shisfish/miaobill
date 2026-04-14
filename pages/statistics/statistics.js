Page({
  data: {
    timeFilter: 'all',
    filteredRecords: [],
    groupedRecords: [],
    monthIncome: '0.00',
    monthExpense: '0.00',
    monthBalance: 0,
    currentYear: 2026,
    currentMonth: 4,
    showMonthPicker: false,
    years: [2024, 2025, 2026, 2027, 2028],
    months: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
    pickerValue: [2, 3],
    tempPickerValue: [2, 3]
  },

  onLoad: function () {
    this.initTestData();
    this.loadRecords();
  },

  onShow: function() {
    this.loadRecords();
  },

  // 初始化测试数据
  initTestData: function() {
    const testRecords = [
      // 2026年4月数据
      { id: 1, date: '2026-04-14', time: '12:30', category: '餐饮', amount: '45.50', type: 2, remark: '午餐' },
      { id: 2, date: '2026-04-14', time: '18:20', category: '交通', amount: '12.00', type: 2, remark: '地铁' },
      { id: 3, date: '2026-04-13', time: '09:15', category: '购物', amount: '128.00', type: 2, remark: '超市' },
      { id: 4, date: '2026-04-13', time: '14:00', category: '娱乐', amount: '68.00', type: 2, remark: '电影' },
      { id: 5, date: '2026-04-12', time: '20:00', category: '日用', amount: '35.80', type: 2, remark: '洗发水' },
      { id: 6, date: '2026-04-10', time: '12:00', category: '餐饮', amount: '88.00', type: 2, remark: '聚餐' },
      { id: 7, date: '2026-04-08', time: '10:30', category: '工资', amount: '8500.00', type: 1, remark: '4月工资' },
      { id: 8, date: '2026-04-05', time: '15:20', category: '医疗', amount: '156.00', type: 2, remark: '买药' },
      { id: 9, date: '2026-04-03', time: '11:00', category: '购物', amount: '299.00', type: 2, remark: '衣服' },
      { id: 10, date: '2026-04-01', time: '08:00', category: '交通', amount: '25.00', type: 2, remark: '打车' },

      // 2026年3月数据
      { id: 11, date: '2026-03-28', time: '12:30', category: '餐饮', amount: '52.00', type: 2, remark: '午餐' },
      { id: 12, date: '2026-03-25', time: '18:00', category: '居住', amount: '2500.00', type: 2, remark: '房租' },
      { id: 13, date: '2026-03-20', time: '09:00', category: '工资', amount: '8500.00', type: 1, remark: '3月工资' },
      { id: 14, date: '2026-03-15', time: '14:30', category: '购物', amount: '468.00', type: 2, remark: '电子产品' },
      { id: 15, date: '2026-03-10', time: '19:00', category: '餐饮', amount: '128.00', type: 2, remark: '晚餐' },

      // 2026年2月数据
      { id: 16, date: '2026-02-28', time: '12:00', category: '餐饮', amount: '38.00', type: 2, remark: '午餐' },
      { id: 17, date: '2026-02-25', time: '10:00', category: '交通', amount: '200.00', type: 2, remark: '加油' },
      { id: 18, date: '2026-02-20', time: '09:00', category: '工资', amount: '8000.00', type: 1, remark: '2月工资' },
      { id: 19, date: '2026-02-14', time: '20:00', category: '娱乐', amount: '520.00', type: 2, remark: '情人节' },
      { id: 20, date: '2026-02-10', time: '15:00', category: '购物', amount: '899.00', type: 2, remark: '鞋子' },

      // 2025年12月数据
      { id: 21, date: '2025-12-31', time: '23:30', category: '娱乐', amount: '200.00', type: 2, remark: '跨年' },
      { id: 22, date: '2025-12-25', time: '18:00', category: '购物', amount: '500.00', type: 2, remark: '圣诞礼物' },
      { id: 23, date: '2025-12-20', time: '09:00', category: '工资', amount: '8000.00', type: 1, remark: '12月工资' },
      { id: 24, date: '2025-12-15', time: '12:00', category: '餐饮', amount: '150.00', type: 2, remark: '聚餐' },

      // 2025年11月数据
      { id: 25, date: '2025-11-28', time: '14:00', category: '购物', amount: '399.00', type: 2, remark: '双十一' },
      { id: 26, date: '2025-11-20', time: '09:00', category: '工资', amount: '8000.00', type: 1, remark: '11月工资' },
      { id: 27, date: '2025-11-11', time: '00:00', category: '购物', amount: '1299.00', type: 2, remark: '双十一抢购' },
      { id: 28, date: '2025-11-05', time: '18:30', category: '餐饮', amount: '78.00', type: 2, remark: '晚餐' }
    ];

    wx.setStorageSync('records', testRecords);
  },
  
  loadRecords: function() {
    const records = wx.getStorageSync('records') || [];
    const { currentYear, currentMonth } = this.data;

    // 筛选当前年月的数据
    const filteredRecords = records.filter(r => {
      const date = new Date(r.date);
      return date.getFullYear() === currentYear && date.getMonth() + 1 === currentMonth;
    }).sort((a, b) => new Date(b.date) - new Date(a.date));

    const groupedRecords = this.groupRecordsByDate(filteredRecords);
    const monthStats = this.calculateMonthStats(records, currentYear, currentMonth);

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

      let dayExpense = 0;
      groups[date].forEach(r => {
        if (r.type === 2) {
          dayExpense += parseFloat(r.amount);
        }
      });

      return {
        date: date,
        dateText: `${month}月${day}日 ${weekday}`,
        records: groups[date],
        dayExpense: dayExpense.toFixed(2)
      };
    });

    return result;
  },
  
  calculateMonthStats: function(records, year, month) {
    let income = 0;
    let expense = 0;

    records.forEach(record => {
      const recordDate = new Date(record.date);
      if (recordDate.getFullYear() === year && recordDate.getMonth() + 1 === month) {
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

  // 显示月份选择器
  showMonthPicker: function() {
    const { years, months, currentYear, currentMonth } = this.data;
    const yearIndex = years.indexOf(currentYear);
    const monthIndex = months.indexOf(currentMonth);
    this.setData({
      showMonthPicker: true,
      pickerValue: [yearIndex, monthIndex],
      tempPickerValue: [yearIndex, monthIndex]
    });
  },

  // 隐藏月份选择器
  hideMonthPicker: function() {
    this.setData({
      showMonthPicker: false
    });
  },

  // 选择器变化
  onPickerChange: function(e) {
    this.setData({
      tempPickerValue: e.detail.value
    });
  },

  // 确认选择
  confirmMonth: function() {
    const { years, months, tempPickerValue } = this.data;
    const selectedYear = years[tempPickerValue[0]];
    const selectedMonth = months[tempPickerValue[1]];

    this.setData({
      currentYear: selectedYear,
      currentMonth: selectedMonth,
      showMonthPicker: false
    }, () => {
      this.loadRecords();
    });
  },

  // 阻止冒泡
  stopPropagation: function() {
    // 什么都不做，只是阻止事件冒泡
  },
  
  getCategoryIcon: function(category) {
    const icons = {
      '餐饮': '🍴',
      '交通': '🚌',
      '购物': '🛍',
      '娱乐': '🎬',
      '医疗': '💊',
      '教育': '📖',
      '居住': '🏠',
      '通讯': '📞',
      '日用': '🧻',
      '彩票': '🎫',
      '水电': '💡',
      '亲友': '👨‍👩‍👧',
      '汽车': '🚙',
      '工资': '💰',
      '奖金': '🧧',
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
  },

  addRecord: function() {
    wx.switchTab({
      url: '/pages/addRecord/addRecord'
    });
  }
})