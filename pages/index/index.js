const { getCategoryIcon } = require('../../utils/categories');
const { getRecordsByMonth, getRecordsByRange } = require('../../utils/api');
const { isUserLoggedIn, performLoginWithAvatar } = require('../../utils/auth');

Page({
  data: {
    period: 'week',
    weekLabels: ['10周', '11周', '12周', '13周'],
    activeWeekIdx: 0,
    totalExpense: '0.00',
    trendList: [],
    rankList: [],
    recentList: [],
    selectedDate: '',
    selectedMonth: '',
    displayDate: '',
    periodText: '',
    showPicker: false,
    showLoginConfirm: false
  },

  onLoad() {
    const now = new Date();
    const todayStr = `${now.getFullYear()}-${String(now.getMonth()+1).padStart(2,'0')}-${String(now.getDate()).padStart(2,'0')}`;
    const monthStr = `${now.getFullYear()}-${String(now.getMonth()+1).padStart(2,'0')}`;
    this.setData({
      selectedDate: todayStr,
      selectedMonth: monthStr,
      displayDate: this.getWeekDisplay(now)
    });
    this.updatePeriodText();
  },

  onShow() {
    this.loadData();
  },

  getWeekDisplay(date) {
    const startOfWeek = new Date(date);
    startOfWeek.setDate(date.getDate() - date.getDay());
    const endOfWeek = new Date(startOfWeek);
    endOfWeek.setDate(startOfWeek.getDate() + 6);
    return `${startOfWeek.getMonth()+1}月${startOfWeek.getDate()}日-${endOfWeek.getMonth()+1}月${endOfWeek.getDate()}日`;
  },

  updateDisplayDate() {
    const { period, selectedDate, selectedMonth } = this.data;
    let displayDate;
    
    if (period === 'week') {
      const dateObj = new Date(selectedDate);
      displayDate = this.getWeekDisplay(dateObj);
    } else if (period === 'month') {
      const dateObj = new Date(selectedDate);
      displayDate = `${dateObj.getFullYear()}年${dateObj.getMonth()+1}月`;
    } else {
      const parts = selectedMonth.split('-');
      displayDate = `${parts[0]}年`;
    }
    
    this.setData({ displayDate });
  },

  updatePeriodText() {
    const period = this.data.period;
    let periodText;
    if (period === 'week') {
      periodText = '本周支出';
    } else if (period === 'month') {
      periodText = '本月支出';
    } else {
      periodText = '本年支出';
    }
    this.setData({ periodText });
  },

  navigatePrev() {
    const { period, selectedDate, selectedMonth } = this.data;
    
    if (period === 'week') {
      const date = new Date(selectedDate);
      date.setDate(date.getDate() - 7);
      this.setData({
        selectedDate: `${date.getFullYear()}-${String(date.getMonth()+1).padStart(2,'0')}-${String(date.getDate()).padStart(2,'0')}`
      }, () => {
        this.updateDisplayDate();
        this.loadData();
      });
    } else if (period === 'month') {
      const parts = selectedMonth.split('-');
      const year = parseInt(parts[0]);
      const month = parseInt(parts[1]);
      let newYear = year;
      let newMonth = month - 1;
      if (newMonth < 1) {
        newMonth = 12;
        newYear--;
      }
      this.setData({
        selectedMonth: `${newYear}-${String(newMonth).padStart(2,'0')}`
      }, () => {
        this.updateDisplayDate();
        this.loadData();
      });
    } else {
      const parts = selectedMonth.split('-');
      const year = parseInt(parts[0]);
      this.setData({
        selectedMonth: `${year - 1}-01`
      }, () => {
        this.updateDisplayDate();
        this.loadData();
      });
    }
  },

  navigateNext() {
    const { period, selectedDate, selectedMonth } = this.data;
    
    if (period === 'week') {
      const date = new Date(selectedDate);
      date.setDate(date.getDate() + 7);
      this.setData({
        selectedDate: `${date.getFullYear()}-${String(date.getMonth()+1).padStart(2,'0')}-${String(date.getDate()).padStart(2,'0')}`
      }, () => {
        this.updateDisplayDate();
        this.loadData();
      });
    } else if (period === 'month') {
      const parts = selectedMonth.split('-');
      const year = parseInt(parts[0]);
      const month = parseInt(parts[1]);
      let newYear = year;
      let newMonth = month + 1;
      if (newMonth > 12) {
        newMonth = 1;
        newYear++;
      }
      this.setData({
        selectedMonth: `${newYear}-${String(newMonth).padStart(2,'0')}`
      }, () => {
        this.updateDisplayDate();
        this.loadData();
      });
    } else {
      const parts = selectedMonth.split('-');
      const year = parseInt(parts[0]);
      this.setData({
        selectedMonth: `${year + 1}-01`
      }, () => {
        this.updateDisplayDate();
        this.loadData();
      });
    }
  },

  showPeriodPicker() {
    this.setData({ showPicker: true });
  },

  onWeekConfirm(e) {
    const selectedDate = e.detail.value;
    this.setData({
      selectedDate,
      showPicker: false
    }, () => {
      this.updateDisplayDate();
      this.loadData();
    });
  },

  onMonthConfirm(e) {
    const { value: selectedMonth } = e.detail;
    this.setData({
      selectedMonth,
      showPicker: false
    }, () => {
      this.updateDisplayDate();
      this.loadData();
    });
  },

  onYearConfirm(e) {
    const { value: selectedMonth } = e.detail;
    this.setData({
      selectedMonth,
      showPicker: false
    }, () => {
      this.updateDisplayDate();
      this.loadData();
    });
  },

  onPickerCancel() {
    this.setData({ showPicker: false });
  },

  switchPeriod(e) {
    this.setData({ period: e.currentTarget.dataset.p });
    this.updatePeriodText();
    this.updateDisplayDate();
    this.loadData();
  },

  pickWeek(e) {
    this.setData({ activeWeekIdx: e.currentTarget.dataset.idx });
    this.loadData();
  },

  loadData() {
    if (!isUserLoggedIn()) {
      this.resetData();
      return;
    }

    const { period, selectedDate, selectedMonth } = this.data;
    let startDate, endDate;

    if (period === 'week') {
      const date = new Date(selectedDate);
      const startOfWeek = new Date(date);
      startOfWeek.setDate(date.getDate() - date.getDay());
      const endOfWeek = new Date(startOfWeek);
      endOfWeek.setDate(startOfWeek.getDate() + 6);
      startDate = `${startOfWeek.getFullYear()}-${String(startOfWeek.getMonth() + 1).padStart(2, '0')}-${String(startOfWeek.getDate()).padStart(2, '0')}`;
      endDate = `${endOfWeek.getFullYear()}-${String(endOfWeek.getMonth() + 1).padStart(2, '0')}-${String(endOfWeek.getDate()).padStart(2, '0')}`;
    } else if (period === 'month') {
      const parts = selectedMonth.split('-');
      const year = parseInt(parts[0]);
      const month = parseInt(parts[1]);
      const daysInMonth = new Date(year, month, 0).getDate();
      startDate = `${year}-${String(month).padStart(2, '0')}-01`;
      endDate = `${year}-${String(month).padStart(2, '0')}-${String(daysInMonth).padStart(2, '0')}`;
    } else {
      const parts = selectedMonth.split('-');
      const year = parseInt(parts[0]);
      startDate = `${year}-01-01`;
      endDate = `${year}-12-31`;
    }

    getRecordsByRange(startDate, endDate)
      .then(records => {
        this.processRecords(records);
      })
      .catch(err => {
        console.error('获取数据失败:', err);
        this.resetData();
      });
  },

  processRecords(records) {
    const expenseRecords = records.filter(r => r.type === 'expense');
    const totalExpense = expenseRecords.reduce((sum, r) => sum + parseFloat(r.amount), 0);

    const categoryMap = {};
    expenseRecords.forEach(r => {
      const cat = r.category;
      const amt = parseFloat(r.amount);
      categoryMap[cat] = (categoryMap[cat] || 0) + amt;
    });

    const sortedCategories = Object.entries(categoryMap)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 6);

    const maxCatAmount = sortedCategories.length > 0 ? sortedCategories[0][1] : 1;

    const rankList = sortedCategories.map(([name, amount]) => ({
      name,
      icon: getCategoryIcon(name),
      pct: totalExpense > 0 ? ((amount / totalExpense) * 100).toFixed(1) + '%' : '0%',
      amount: amount.toFixed(1),
      barWidth: Math.round((amount / maxCatAmount) * 100)
    }));

    const trendList = this.buildTrendList(expenseRecords, this.data.period);

    const recentList = records
      .sort((a, b) => new Date(b.date) - new Date(a.date))
      .slice(0, 4)
      .map(r => ({
        title: r.description || r.category,
        category: r.category,
        time: `${r.date} ${r.createTime ? r.createTime.substring(11, 16) : ''}`,
        amount: r.type === 'expense' ? `-${parseFloat(r.amount).toFixed(2)}` : `+${parseFloat(r.amount).toFixed(2)}`,
        icon: getCategoryIcon(r.category)
      }));

    this.setData({
      totalExpense: totalExpense.toFixed(2),
      trendList,
      trendChartWidth: trendList.length * 80,
      rankList,
      recentList
    });
  },
  
  resetData() {
    this.setData({
      totalExpense: '0.00',
      trendList: [],
      rankList: [],
      recentList: []
    });
  },

  buildTrendList(records, period) {
    const now = new Date();
    const year = now.getFullYear();
    const month = now.getMonth() + 1;
    const list = [];

    if (period === 'week') {
      for (let i = 6; i >= 0; i--) {
        const d = new Date(now);
        d.setDate(d.getDate() - i);
        const m = d.getMonth() + 1;
        const day = d.getDate();
        list.push({
          label: `${m}/${day}`,
          value: 0,
          dateStr: `${d.getFullYear()}-${String(m).padStart(2, '0')}-${String(day).padStart(2, '0')}`
        });
      }

      records.forEach(record => {
        for (let i = 0; i < list.length; i++) {
          if (list[i].dateStr === record.date) {
            list[i].value += Number(record.amount) || 0;
            break;
          }
        }
      });
    } else if (period === 'month') {
      const daysInMonth = new Date(year, month, 0).getDate();
      const today = now.getDate();
      const endDay = (now.getFullYear() === year && now.getMonth() + 1 === month) ? today : daysInMonth;
      for (let d = 1; d <= endDay; d++) {
        list.push({
          label: `${d}日`,
          value: 0,
          dateStr: `${year}-${String(month).padStart(2, '0')}-${String(d).padStart(2, '0')}`
        });
      }

      records.forEach(record => {
        for (let i = 0; i < list.length; i++) {
          if (list[i].dateStr === record.date) {
            list[i].value += Number(record.amount) || 0;
            break;
          }
        }
      });
    } else if (period === 'year') {
      for (let m = 1; m <= month; m++) {
        list.push({
          label: `${m}月`,
          value: 0,
          month: m
        });
      }

      records.forEach(record => {
        const recordDate = new Date(record.date);
        const recordMonth = recordDate.getMonth() + 1;
        const recordYear = recordDate.getFullYear();
        if (recordYear === year) {
          for (let i = 0; i < list.length; i++) {
            if (list[i].month === recordMonth) {
              list[i].value += Number(record.amount) || 0;
              break;
            }
          }
        }
      });
    }

    const max = Math.max(...list.map(item => item.value), 1);

    return list.map(item => ({
      label: item.label,
      value: item.value,
      heightPercent: Math.round((item.value / max) * 100)
    }));
  },

  drawChart(data) {
    if (!data.length) return;
  },

  addRecord() {
    if (!isUserLoggedIn()) {
      this.setData({ showLoginConfirm: true });
    } else {
      wx.switchTab({ url: '/pages/addRecord/addRecord' });
    }
  },

  onChooseAvatar(e) {
    const avatarUrl = e.detail && e.detail.avatarUrl;
    if (!avatarUrl) {
      console.log('未选择头像或取消选择');
      return;
    }

    performLoginWithAvatar(avatarUrl)
      .then(userInfo => {
        this.setData({ showLoginConfirm: false });
        this.loadData();
        wx.switchTab({ url: '/pages/addRecord/addRecord' });
      })
      .catch(err => {
        if (err.message !== '用户取消登录') {
          console.error('登录失败:', err);
        }
      });
  },

  onLoginCancel() {
    this.setData({ showLoginConfirm: false });
  },

  onUnload() {
    // 清理资源
  }
});