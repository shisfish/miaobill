const { getCategoryIcon } = require('../../utils/categories');

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
    const records = wx.getStorageSync('records') || [];
    const expenseRecords = records.filter(r => r.type === 2);

    if (!expenseRecords.length) {
      this.setData({
        hasRealData: false,
        totalExpense: this.data.mockSummary.totalExpense,
        avgExpense: this.data.mockSummary.avgExpense,
        rightTotal: this.data.mockSummary.rightTotal,
        trendList: this.data.mockTrendList,
        rankList: this.data.mockRankList,
        recentList: this.data.mockRecentList
      });
      return;
    }

    const categoryMap = {};
    let total = 0;

    expenseRecords.forEach(record => {
      const amount = Number(record.amount) || 0;
      total += amount;
      categoryMap[record.category] = (categoryMap[record.category] || 0) + amount;
    });

    const rankList = Object.keys(categoryMap)
      .map(name => ({
        name,
        icon: getCategoryIcon(name),
        amount: categoryMap[name].toFixed(1),
        pct: total ? ((categoryMap[name] / total) * 100).toFixed(1) + '%' : '0.0%',
        barWidth: total ? Math.max(Math.round((categoryMap[name] / total) * 100), 3) : 3
      }))
      .sort((a, b) => Number(b.amount) - Number(a.amount));

    const recentList = expenseRecords
      .slice()
      .reverse()
      .slice(0, 4)
      .map(item => ({
        title: item.title || item.category || '记账',
        category: item.category || '其他',
        time: item.date || '刚刚',
        amount: `-${Number(item.amount || 0).toFixed(2)}`,
        icon: item.categoryIcon || getCategoryIcon(item.category)
      }));

    const trendList = this.buildTrendList(expenseRecords);
    const latestBalance = Number(wx.getStorageSync('balance') || 0);

    this.setData({
      hasRealData: true,
      totalExpense: total.toFixed(2),
      avgExpense: (total / expenseRecords.length).toFixed(2),
      rightTotal: latestBalance.toFixed(2),
      trendList,
      rankList,
      recentList
    });

    setTimeout(() => this.drawChart(trendList), 150);
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
  }
});
