// 分类数据
const categories = [
  // 收入分类
  { name: '工资', icon: '💰', type: 1 },
  { name: '奖金', icon: '🏆', type: 1 },
  { name: '投资', icon: '📈', type: 1 },
  { name: '其他', icon: '➕', type: 1 },
  
  // 支出分类
  { name: '餐饮', icon: '🍽️', type: 2 },
  { name: '交通', icon: '🚗', type: 2 },
  { name: '购物', icon: '🛍️', type: 2 },
  { name: '娱乐', icon: '🎬', type: 2 },
  { name: '医疗', icon: '🏥', type: 2 },
  { name: '教育', icon: '📚', type: 2 },
  { name: '住房', icon: '🏠', type: 2 },
  { name: '其他', icon: '📋', type: 2 }
];

Page({
  data: {
    selectedMonth: new Date().toISOString().split('T')[0].substring(0, 7),
    monthIncome: 0,
    monthExpense: 0,
    balance: 0,
    activeType: 2, // 默认支出
    categoryDetails: []
  },
  
  onLoad: function () {
    this.updateData();
  },
  
  onShow: function () {
    this.updateData();
  },
  
  // 月份选择
  onMonthChange: function(e) {
    this.setData({
      selectedMonth: e.detail.value
    });
    this.updateData();
  },
  
  // 切换收支类型
  switchType: function(e) {
    const type = parseInt(e.currentTarget.dataset.type);
    this.setData({
      activeType: type
    });
    this.updateData();
  },
  
  // 更新数据
  updateData: function() {
    const records = wx.getStorageSync('records') || [];
    const { selectedMonth, activeType } = this.data;
    
    // 筛选当月记录
    const monthRecords = records.filter(record => record.date.substring(0, 7) === selectedMonth);
    
    // 计算当月收支
    const monthIncome = monthRecords.filter(record => record.type === 1).reduce((sum, record) => sum + record.amount, 0);
    const monthExpense = monthRecords.filter(record => record.type === 2).reduce((sum, record) => sum + record.amount, 0);
    const balance = monthIncome - monthExpense;
    
    // 计算分类明细
    const typeRecords = monthRecords.filter(record => record.type === activeType);
    const categoryMap = {};
    
    // 统计各分类金额
    typeRecords.forEach(record => {
      if (categoryMap[record.category]) {
        categoryMap[record.category] += record.amount;
      } else {
        categoryMap[record.category] = record.amount;
      }
    });
    
    // 计算总金额
    const totalAmount = Object.values(categoryMap).reduce((sum, amount) => sum + amount, 0);
    
    // 生成分类明细
    const categoryDetails = Object.entries(categoryMap).map(([category, amount]) => ({
      category: category,
      amount: amount.toFixed(2),
      percentage: totalAmount > 0 ? Math.round((amount / totalAmount) * 100) : 0
    })).sort((a, b) => parseFloat(b.amount) - parseFloat(a.amount));
    
    this.setData({
      monthIncome: monthIncome.toFixed(2),
      monthExpense: monthExpense.toFixed(2),
      balance: balance.toFixed(2),
      categoryDetails: categoryDetails
    });
    
    // 绘制饼图（后续可以引入ECharts实现）
    this.drawPieChart(categoryDetails, totalAmount);
  },
  
  // 绘制饼图
  drawPieChart: function(categoryDetails, totalAmount) {
    // 这里可以使用ECharts绘制饼图
    // 由于微信小程序中使用ECharts需要先引入库，这里暂时省略
    console.log('绘制饼图', categoryDetails, totalAmount);
  },
  
  // 获取分类图标
  getCategoryIcon: function(categoryName) {
    const category = categories.find(cat => cat.name === categoryName);
    return category ? category.icon : '📋';
  }
})