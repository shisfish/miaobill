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
    todayIncome: 0,
    todayExpense: 0,
    monthIncome: 0,
    monthExpense: 0,
    recentRecords: []
  },
  
  onLoad: function () {
    this.updateData();
  },
  
  onShow: function () {
    this.updateData();
  },
  
  // 更新数据
  updateData: function() {
    const records = wx.getStorageSync('records') || [];
    const today = new Date().toISOString().split('T')[0];
    const month = new Date().toISOString().split('T')[0].substring(0, 7);
    
    // 计算今日收支
    const todayRecords = records.filter(record => record.date === today);
    const todayIncome = todayRecords.filter(record => record.type === 1).reduce((sum, record) => sum + record.amount, 0);
    const todayExpense = todayRecords.filter(record => record.type === 2).reduce((sum, record) => sum + record.amount, 0);
    
    // 计算本月收支
    const monthRecords = records.filter(record => record.date.substring(0, 7) === month);
    const monthIncome = monthRecords.filter(record => record.type === 1).reduce((sum, record) => sum + record.amount, 0);
    const monthExpense = monthRecords.filter(record => record.type === 2).reduce((sum, record) => sum + record.amount, 0);
    
    // 获取最近交易记录
    const recentRecords = records.sort((a, b) => b.createTime - a.createTime).slice(0, 10);
    
    this.setData({
      todayIncome: todayIncome.toFixed(2),
      todayExpense: todayExpense.toFixed(2),
      monthIncome: monthIncome.toFixed(2),
      monthExpense: monthExpense.toFixed(2),
      recentRecords: recentRecords
    });
  },
  
  // 跳转到记账页面
  goToAddRecord: function() {
    wx.navigateTo({
      url: '../addRecord/addRecord'
    });
  },
  
  // 获取分类图标
  getCategoryIcon: function(categoryName) {
    const category = categories.find(cat => cat.name === categoryName);
    return category ? category.icon : '📋';
  }
})