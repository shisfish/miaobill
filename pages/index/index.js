Page({
  data: {
    viewMode: 'month',
    currentDate: '',
    displayDate: '',
    totalExpense: 0,
    totalIncome: 0,
    balance: 0,
    expenseCategories: [],
    incomeCategories: []
  },
  
  onLoad: function () {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const currentDate = `${year}-${month}`;
    this.setData({
      currentDate: currentDate
    });
    this.updateDisplayDate();
    this.calculateData();
  },
  
  onShow: function() {
    this.calculateData();
  },
  
  switchViewMode: function(e) {
    const mode = e.currentTarget.dataset.mode;
    this.setData({
      viewMode: mode
    });
    this.updateDisplayDate();
    this.calculateData();
  },
  
  onDateChange: function(e) {
    const date = e.detail.value;
    const year = date.substring(0, 4);
    const month = date.substring(5, 7);
    this.setData({
      currentDate: `${year}-${month}`
    });
    this.updateDisplayDate();
    this.calculateData();
  },
  
  prevPeriod: function() {
    const date = new Date(this.data.currentDate);
    if (this.data.viewMode === 'month') {
      date.setMonth(date.getMonth() - 1);
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0');
      this.setData({
        currentDate: `${year}-${month}`
      });
    } else {
      date.setFullYear(date.getFullYear() - 1);
      const year = date.getFullYear();
      this.setData({
        currentDate: `${year}-01`
      });
    }
    this.updateDisplayDate();
    this.calculateData();
  },
  
  nextPeriod: function() {
    const date = new Date(this.data.currentDate);
    if (this.data.viewMode === 'month') {
      date.setMonth(date.getMonth() + 1);
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0');
      this.setData({
        currentDate: `${year}-${month}`
      });
    } else {
      date.setFullYear(date.getFullYear() + 1);
      const year = date.getFullYear();
      this.setData({
        currentDate: `${year}-01`
      });
    }
    this.updateDisplayDate();
    this.calculateData();
  },
  
  updateDisplayDate: function() {
    const dateParts = this.data.currentDate.split('-');
    if (this.data.viewMode === 'month') {
      this.setData({
        displayDate: `${dateParts[0]}年${dateParts[1]}月`
      });
    } else {
      this.setData({
        displayDate: `${dateParts[0]}年`
      });
    }
  },
  
  calculateData: function() {
    const records = wx.getStorageSync('records') || [];
    const filteredRecords = this.filterRecordsByDate(records);
    
    let totalExpense = 0;
    let totalIncome = 0;
    const expenseMap = {};
    const incomeMap = {};
    
    const expenseIcons = {
      '餐饮': '🍽️',
      '交通': '🚗',
      '购物': '🛍️',
      '娱乐': '🎮',
      '医疗': '🏥',
      '教育': '📚',
      '居住': '🏠',
      '通讯': '📱',
      '其他': '📦'
    };
    
    const incomeIcons = {
      '工资': '💼',
      '奖金': '🎁',
      '投资': '📈',
      '兼职': '💻',
      '其他': '💰'
    };
    
    filteredRecords.forEach(record => {
      if (record.type === 2) {
        totalExpense += parseFloat(record.amount);
        if (!expenseMap[record.category]) {
          expenseMap[record.category] = 0;
        }
        expenseMap[record.category] += parseFloat(record.amount);
      } else {
        totalIncome += parseFloat(record.amount);
        if (!incomeMap[record.category]) {
          incomeMap[record.category] = 0;
        }
        incomeMap[record.category] += parseFloat(record.amount);
      }
    });
    
    const expenseCategories = Object.keys(expenseMap).map(name => ({
      name: name,
      amount: expenseMap[name].toFixed(2),
      percentage: totalExpense > 0 ? ((expenseMap[name] / totalExpense) * 100).toFixed(1) : 0,
      icon: expenseIcons[name] || '📦'
    })).sort((a, b) => parseFloat(b.amount) - parseFloat(a.amount));
    
    const incomeCategories = Object.keys(incomeMap).map(name => ({
      name: name,
      amount: incomeMap[name].toFixed(2),
      percentage: totalIncome > 0 ? ((incomeMap[name] / totalIncome) * 100).toFixed(1) : 0,
      icon: incomeIcons[name] || '💰'
    })).sort((a, b) => parseFloat(b.amount) - parseFloat(a.amount));
    
    const balance = totalIncome - totalExpense;
    
    this.setData({
      totalExpense: totalExpense.toFixed(2),
      totalIncome: totalIncome.toFixed(2),
      balance: balance.toFixed(2) || '0.00',
      expenseCategories: expenseCategories,
      incomeCategories: incomeCategories
    });
  },
  
  filterRecordsByDate: function(records) {
    const dateParts = this.data.currentDate.split('-');
    const targetYear = parseInt(dateParts[0]);
    const targetMonth = parseInt(dateParts[1]);
    
    return records.filter(record => {
      const recordDate = new Date(record.date);
      const recordYear = recordDate.getFullYear();
      const recordMonth = recordDate.getMonth() + 1;
      
      if (this.data.viewMode === 'month') {
        return recordYear === targetYear && recordMonth === targetMonth;
      } else {
        return recordYear === targetYear;
      }
    });
  }
})