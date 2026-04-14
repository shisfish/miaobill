Page({
  data: {
    period: 'week',
    weekLabels: ['10周','11周','12周','13周'],
    activeWeekIdx: 0,
    totalExpense: '2101.00',
    avgExpense: '300.14',
    rightTotal: '1457.20',
    rankList: [
      { name: '日用', icon: '🧻', pct: '31.7%', amount: '666.9', barWidth: 100 },
      { name: '汽车', icon: '🚗', pct: '24.2%', amount: '508', barWidth: 76 },
      { name: '水电', icon: '⚡', pct: '21.3%', amount: '447.9', barWidth: 67 },
      { name: '亲友', icon: '👨‍👩‍👧', pct: '11.1%', amount: '233.9', barWidth: 35 },
      { name: '餐饮', icon: '🍴', pct: '7.5%', amount: '158.5', barWidth: 24 },
      { name: '交通', icon: '🚌', pct: '1.4%', amount: '30.1', barWidth: 4 },
      { name: '娱乐', icon: '🎤', pct: '1.1%', amount: '24', barWidth: 3 }
    ]
  },

  onLoad() {
    this.loadData();
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
    
    // 计算总支出
    let total = 0;
    const map = {};
    records.forEach(r => {
      if (r.type === 2) {
        total += parseFloat(r.amount);
        map[r.category] = (map[r.category] || 0) + parseFloat(r.amount);
      }
    });

    // 排行榜
    const list = Object.keys(map).map(k => ({
      name: k,
      icon: this.getCatIcon(k),
      amount: map[k].toFixed(1),
      pct: (map[k] / total * 100).toFixed(1) + '%',
      barWidth: Math.round((map[k] / total) * 100)
    })).sort((a, b) => parseFloat(b.amount) - parseFloat(a.amount));

    this.setData({
      totalExpense: total.toFixed(2),
      avgExpense: (total / Math.max(records.filter(r => r.type === 2).length, 1)).toFixed(2),
      rankList: list
    });

    // 绘制图表
    setTimeout(() => this.drawChart(list), 300);
  },

  getCatIcon(name) {
    const m = {
      '餐饮':'🍴','交通':'🚌','购物':'🛍','娱乐':'🎤',
      '医疗':'💊','日用':'🧻','彩票':'🎫','水电':'⚡',
      '亲友':'👨‍👩‍👧','汽车':'🚗'
    };
    return m[name] || '📦';
  },

  drawChart(data) {
    if (!data.length) return;
    // 简易绘制 - 可后续用canvas API实现完整折线图
  },

  addRecord() {
    wx.switchTab({ url: '/pages/addRecord/addRecord' });
  }
});
