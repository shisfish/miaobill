// 分类数据
const categories = [
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
    totalBudget: 0,
    usedAmount: 0,
    remainingAmount: 0,
    budgetList: [],
    reminderEnabled: false,
    reminderThresholds: ['50%', '60%', '70%', '80%', '90%', '100%'],
    selectedThreshold: 4 // 默认90%
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
  
  // 更新数据
  updateData: function() {
    const records = wx.getStorageSync('records') || [];
    const budgets = wx.getStorageSync('budgets') || [];
    const { selectedMonth } = this.data;
    
    // 筛选当月支出记录
    const monthExpenses = records.filter(record => 
      record.date.substring(0, 7) === selectedMonth && record.type === 2
    );
    
    // 计算当月总支出
    const usedAmount = monthExpenses.reduce((sum, record) => sum + record.amount, 0);
    
    // 计算各分类支出
    const categoryExpenses = {};
    monthExpenses.forEach(record => {
      if (categoryExpenses[record.category]) {
        categoryExpenses[record.category] += record.amount;
      } else {
        categoryExpenses[record.category] = record.amount;
      }
    });
    
    // 生成预算列表
    const budgetList = categories.map(category => {
      // 查找该分类当月预算
      const budget = budgets.find(b => 
        b.category === category.name && b.month === selectedMonth
      );
      const budgetAmount = budget ? budget.amount : 0;
      const expenseAmount = categoryExpenses[category.name] || 0;
      const percentage = budgetAmount > 0 ? Math.round((expenseAmount / budgetAmount) * 100) : 0;
      
      return {
        category: category.name,
        budget: budgetAmount.toFixed(2),
        used: expenseAmount.toFixed(2),
        percentage: percentage
      };
    });
    
    // 计算总预算
    const totalBudget = budgetList.reduce((sum, item) => sum + parseFloat(item.budget), 0);
    const remainingAmount = totalBudget - usedAmount;
    
    this.setData({
      totalBudget: totalBudget.toFixed(2),
      usedAmount: usedAmount.toFixed(2),
      remainingAmount: remainingAmount.toFixed(2),
      budgetList: budgetList
    });
  },
  
  // 设置预算
  setBudget: function(e) {
    const category = e.currentTarget.dataset.category;
    
    wx.showModal({
      title: '设置预算',
      content: `请为${category}设置月度预算`,
      editable: true,
      placeholderText: '输入预算金额',
      success: (res) => {
        if (res.confirm) {
          const budgetAmount = parseFloat(res.content);
          if (!isNaN(budgetAmount) && budgetAmount >= 0) {
            this.saveBudget(category, budgetAmount);
          } else {
            wx.showToast({
              title: '请输入有效金额',
              icon: 'none'
            });
          }
        }
      }
    });
  },
  
  // 保存预算
  saveBudget: function(category, amount) {
    const budgets = wx.getStorageSync('budgets') || [];
    const { selectedMonth } = this.data;
    
    // 查找是否已有该分类当月预算
    const index = budgets.findIndex(b => 
      b.category === category && b.month === selectedMonth
    );
    
    if (index > -1) {
      // 更新现有预算
      budgets[index].amount = amount;
      budgets[index].createTime = Date.now();
    } else {
      // 添加新预算
      budgets.push({
        category: category,
        amount: amount,
        month: selectedMonth,
        createTime: Date.now()
      });
    }
    
    // 保存到本地存储
    wx.setStorageSync('budgets', budgets);
    
    // 更新数据
    this.updateData();
    
    wx.showToast({
      title: '预算设置成功',
      icon: 'success'
    });
  },
  
  // 切换提醒
  toggleReminder: function(e) {
    this.setData({
      reminderEnabled: e.detail.value
    });
    
    // 保存提醒设置
    wx.setStorageSync('reminderEnabled', e.detail.value);
  },
  
  // 选择提醒阈值
  onThresholdChange: function(e) {
    this.setData({
      selectedThreshold: e.detail.value
    });
    
    // 保存提醒阈值
    wx.setStorageSync('reminderThreshold', e.detail.value);
  },
  
  // 获取分类图标
  getCategoryIcon: function(categoryName) {
    const category = categories.find(cat => cat.name === categoryName);
    return category ? category.icon : '📋';
  }
})