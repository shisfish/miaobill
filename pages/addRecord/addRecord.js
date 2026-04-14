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
    amount: '',
    type: 2, // 默认支出
    selectedCategory: '餐饮',
    date: new Date().toISOString().split('T')[0],
    time: new Date().toTimeString().split(' ')[0].substring(0, 5),
    remark: '',
    categories: categories.filter(cat => cat.type === 2) // 默认显示支出分类
  },
  
  // 金额输入
  onAmountChange: function(e) {
    this.setData({
      amount: e.detail.value
    });
  },
  
  // 选择收支类型
  selectType: function(e) {
    const type = parseInt(e.currentTarget.dataset.type);
    this.setData({
      type: type,
      categories: categories.filter(cat => cat.type === type),
      selectedCategory: type === 1 ? '工资' : '餐饮'
    });
  },
  
  // 选择分类
  selectCategory: function(e) {
    const category = e.currentTarget.dataset.category;
    this.setData({
      selectedCategory: category
    });
  },
  
  // 日期选择
  onDateChange: function(e) {
    this.setData({
      date: e.detail.value
    });
  },
  
  // 时间选择
  onTimeChange: function(e) {
    this.setData({
      time: e.detail.value
    });
  },
  
  // 备注输入
  onRemarkChange: function(e) {
    this.setData({
      remark: e.detail.value
    });
  },
  
  // 保存记录
  saveRecord: function() {
    const { amount, type, selectedCategory, date, time, remark } = this.data;
    
    // 验证金额
    if (!amount || parseFloat(amount) <= 0) {
      wx.showToast({
        title: '请输入有效金额',
        icon: 'none'
      });
      return;
    }
    
    // 获取分类图标
    const category = categories.find(cat => cat.name === selectedCategory);
    const categoryIcon = category ? category.icon : '📋';
    
    // 创建记录
    const record = {
      id: Date.now().toString(),
      type: type,
      amount: parseFloat(amount),
      category: selectedCategory,
      categoryIcon: categoryIcon,
      date: date,
      time: time,
      remark: remark,
      createTime: Date.now()
    };
    
    // 保存到本地存储
    const records = wx.getStorageSync('records') || [];
    records.push(record);
    wx.setStorageSync('records', records);
    
    // 提示保存成功
    wx.showToast({
      title: '保存成功',
      icon: 'success'
    });
    
    // 返回首页
    setTimeout(() => {
      wx.navigateBack();
    }, 1000);
  }
})