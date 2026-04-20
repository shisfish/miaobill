Page({
  data: {
    timeFilter: 'all',
    filteredRecords: [],
    groupedRecords: [],
    monthExpense: '0.00',
    currentYear: 2026,
    currentMonth: 4,
    showMonthPicker: false,
    years: (function() {
      const now = new Date();
      const startYear = 2018;
      const endYear = now.getFullYear() + 1;
      const arr = [];
      for (let y = startYear; y <= endYear; y++) arr.push(y);
      return arr;
    })(),
    months: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
    pickerValue: [11, 3],
    tempPickerValue: [11, 3]
  },

  onLoad: function () {
    this.initTestData();
    this.loadRecords();
  },

  onShow: function() {
    this.loadRecords();
  },

  // 初始化测试数据 - 匹配参考图
  initTestData: function() {
    const testRecords = [
      // 2026年4月12日（星期日）- 匹配参考图
      { id: 101, date: '2026-04-12', time: '08:30', category: '餐饮',   amount: '20.00',  type: 2, remark: '早餐' },
      { id: 102, date: '2026-04-12', time: '12:00', category: '餐饮',   amount: '35.00',  type: 2, remark: '午餐' },
      { id: 103, date: '2026-04-12', time: '18:00', category: '购物',   amount: '588.80', type: 2, remark: '买衣服' },

      // 其他日期凑够 2101.00 支出
      { id: 201, date: '2026-04-06', time: '09:00', category: '水电',   amount: '1457.20', type: 2, remark: '房租水电' }
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
      monthExpense: monthStats.expense
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
    const { years, months, currentYear, currentMonth } = this.data;
    const yearIndex = years.indexOf(currentYear);
    const monthIndex = months.indexOf(currentMonth);
    this.setData({
      showMonthPicker: true,
      pickerValue: [yearIndex >= 0 ? yearIndex : 0, monthIndex],
      tempPickerValue: [yearIndex >= 0 ? yearIndex : 0, monthIndex]
    });
  },

  hideMonthPicker: function() {
    this.setData({
      showMonthPicker: false
    });
  },

  onPickerChange: function(e) {
    this.setData({
      tempPickerValue: e.detail.value
    });
  },

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

  stopPropagation: function() {},
  
  getCategoryIcon: function(category) {
    const icons = {
      '餐饮': '🍴',   '交通': '🚌',  '购物': '🛍',
      '娱乐': '🎤',   '医疗': '💊',  '教育': '📖',
      '居住': '🏠',   '通讯': '📞',  '日用': '🧻',
      '彩票': '🎫',   '水电': '⚡',  '亲友': '👨‍👩‍👧',
      '汽车': '🚗',   '其他': '📦'
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