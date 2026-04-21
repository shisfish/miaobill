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
    console.log('开始加载数据');
    console.log('模拟数据:', this.data.mockSummary);
    // 暂时使用模拟数据，避免网络请求错误
    this.setData({
      hasRealData: false,
      totalExpense: this.data.mockSummary.totalExpense,
      avgExpense: this.data.mockSummary.avgExpense,
      rightTotal: this.data.mockSummary.rightTotal,
      trendList: this.data.mockTrendList,
      rankList: this.data.mockRankList,
      recentList: this.data.mockRecentList
    }, () => {
      console.log('数据设置完成');
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