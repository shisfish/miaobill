const { getCategoryIcon } = require('../../utils/categories');
const { getRecordsByMonth } = require('../../utils/api');

Page({
  data: {
    period: 'week',
    weekLabels: ['10周', '11周', '12周', '13周'],
    activeWeekIdx: 0,
    hasRealData: false,
    totalExpense: '0.00',
    avgExpense: '0.00',
    rightTotal: '0.00',
    trendList: [],
    rankList: [],
    recentList: [],
    mockSummary: {
      totalExpense: '3680.40',
      avgExpense: '526.34',
      rightTotal: '1820.60'
    },
    mockTrendList: [
      { label: '周一', value: 32, heightPercent: 35 },
      { label: '周二', value: 48, heightPercent: 52 },
      { label: '周三', value: 39, heightPercent: 42 },
      { label: '周四', value: 76, heightPercent: 83 },
      { label: '周五', value: 58, heightPercent: 63 },
      { label: '周六', value: 92, heightPercent: 100 },
      { label: '周日', value: 66, heightPercent: 72 }
    ],
    mockRankList: [
      { name: '日用', icon: '🧻', pct: '31.7%', amount: '666.9', barWidth: 100 },
      { name: '汽车', icon: '🚗', pct: '24.2%', amount: '508.0', barWidth: 76 },
      { name: '水电', icon: '⚡', pct: '21.3%', amount: '447.9', barWidth: 67 },
      { name: '亲友', icon: '👨‍👩‍👧', pct: '11.1%', amount: '233.9', barWidth: 35 },
      { name: '餐饮', icon: '🍴', pct: '7.5%', amount: '158.5', barWidth: 24 },
      { name: '交通', icon: '🚌', pct: '1.4%', amount: '30.1', barWidth: 4 }
    ],
    mockRecentList: [
      { title: '超市采购', category: '日用', time: '今天 19:20', amount: '-128.00', icon: '🧻' },
      { title: '加油', category: '汽车', time: '今天 14:05', amount: '-260.00', icon: '🚗' },
      { title: '午餐', category: '餐饮', time: '今天 12:30', amount: '-36.50', icon: '🍴' },
      { title: '水费', category: '水电', time: '昨天 09:10', amount: '-58.00', icon: '⚡' }
    ]
  },

  onShow() {
    this.loadData();
  },

  switchPeriod(e) {
    this.setData({ period: e.currentTarget.dataset.p });
    this.loadData();
  },

  pickWeek(e) {
    this.setData({ activeWeekIdx: e.currentTarget.dataset.idx });
    this.loadData();
  },

  loadData() {
    const now = new Date();
    const year = now.getFullYear();
    const month = now.getMonth() + 1;

    getRecordsByMonth(year, month)
      .then(records => {
        this.processRecords(records);
      })
      .catch(err => {
        console.error('获取数据失败:', err);
        this.setMockData();
      });
  },

  processRecords(records) {
    const expenseRecords = records.filter(r => r.type === 'expense');
    const totalExpense = expenseRecords.reduce((sum, r) => sum + parseFloat(r.amount), 0);
    const avgExpense = expenseRecords.length > 0 ? totalExpense / expenseRecords.length : 0;

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

    const trendList = this.buildTrendList(expenseRecords);

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
      hasRealData: true,
      totalExpense: totalExpense.toFixed(2),
      avgExpense: avgExpense.toFixed(2),
      rightTotal: totalExpense.toFixed(2),
      trendList,
      rankList,
      recentList
    });
  },
  
  setMockData() {
    this.setData({
      hasRealData: false,
      totalExpense: this.data.mockSummary.totalExpense,
      avgExpense: this.data.mockSummary.avgExpense,
      rightTotal: this.data.mockSummary.rightTotal,
      trendList: this.data.mockTrendList,
      rankList: this.data.mockRankList,
      recentList: this.data.mockRecentList
    });
  },

  buildTrendList(records) {
    const list = [
      { label: '周一', value: 0 },
      { label: '周二', value: 0 },
      { label: '周三', value: 0 },
      { label: '周四', value: 0 },
      { label: '周五', value: 0 },
      { label: '周六', value: 0 },
      { label: '周日', value: 0 }
    ];

    records.slice(0, 7).forEach((record, index) => {
      list[index].value = Number(record.amount) || 0;
    });

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
    wx.switchTab({ url: '/pages/addRecord/addRecord' });
  },

  onUnload() {
    // 清理资源
  }
});