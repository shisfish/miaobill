Page({
  data: {
    type: 2,
    amount: '',
    selectedCategory: '',
    remark: '',
    date: '',
    categories: [],
    showModal: false
  },
  
  expenseCategories: [
    { name: '餐饮', icon: '🍽️' },
    { name: '交通', icon: '🚗' },
    { name: '购物', icon: '🛍️' },
    { name: '娱乐', icon: '🎮' },
    { name: '医疗', icon: '🏥' },
    { name: '教育', icon: '📚' },
    { name: '居住', icon: '🏠' },
    { name: '通讯', icon: '📱' },
    { name: '其他', icon: '📦' }
  ],
  
  incomeCategories: [
    { name: '工资', icon: '💼' },
    { name: '奖金', icon: '🎁' },
    { name: '投资', icon: '📈' },
    { name: '兼职', icon: '💻' },
    { name: '其他', icon: '💰' }
  ],
  
  onLoad: function () {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');
    
    this.setData({
      date: `${year}-${month}-${day}`,
      categories: this.expenseCategories,
      selectedCategory: '餐饮'
    });
  },
  
  switchType: function(e) {
    const type = parseInt(e.currentTarget.dataset.type);
    const categories = type === 1 ? this.incomeCategories : this.expenseCategories;
    const defaultCategory = type === 1 ? '工资' : '餐饮';
    
    this.setData({
      type: type,
      categories: categories,
      selectedCategory: defaultCategory
    });
  },
  
  selectCategory: function(e) {
    const category = e.currentTarget.dataset.category;
    this.setData({
      selectedCategory: category
    });
  },
  
  inputNumber: function(e) {
    const key = e.currentTarget.dataset.key;
    let amount = this.data.amount;
    
    if (key === '.' && amount.includes('.')) {
      return;
    }
    
    if (amount === '0' && key !== '.') {
      amount = '';
    }
    
    if (key === '.' && amount === '') {
      amount = '0';
    }
    
    const decimalIndex = amount.indexOf('.');
    if (decimalIndex !== -1 && amount.length - decimalIndex > 2) {
      return;
    }
    
    amount += key;
    this.setData({ amount: amount });
  },
  
  deleteNumber: function() {
    let amount = this.data.amount;
    if (amount.length > 0) {
      amount = amount.substring(0, amount.length - 1);
      this.setData({ amount: amount });
    }
  },
  
  clearAmount: function() {
    this.setData({ amount: '' });
  },
  
  onDateChange: function(e) {
    this.setData({
      date: e.detail.value
    });
  },
  
  showRemarkModal: function() {
    this.setData({
      showModal: true
    });
  },
  
  hideRemarkModal: function() {
    this.setData({
      showModal: false
    });
  },
  
  stopPropagation: function() {
  },
  
  onRemarkInput: function(e) {
    this.setData({
      remark: e.detail.value
    });
  },
  
  confirmRemark: function() {
    this.setData({
      showModal: false
    });
  },
  
  saveRecord: function() {
    const amount = this.data.amount;
    
    if (!amount || parseFloat(amount) <= 0) {
      wx.showToast({
        title: '请输入金额',
        icon: 'none'
      });
      return;
    }
    
    if (!this.data.selectedCategory) {
      wx.showToast({
        title: '请选择分类',
        icon: 'none'
      });
      return;
    }
    
    const now = new Date();
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    
    const record = {
      id: Date.now(),
      type: this.data.type,
      amount: parseFloat(amount).toFixed(2),
      category: this.data.selectedCategory,
      remark: this.data.remark,
      date: this.data.date,
      time: `${hours}:${minutes}`,
      createdAt: now.toISOString()
    };
    
    const records = wx.getStorageSync('records') || [];
    records.unshift(record);
    wx.setStorageSync('records', records);
    
    wx.showToast({
      title: '保存成功',
      icon: 'success',
      duration: 1500
    });
    
    setTimeout(() => {
      this.setData({
        amount: '',
        remark: '',
        selectedCategory: this.data.type === 1 ? '工资' : '餐饮'
      });
      
      wx.switchTab({
        url: '/pages/statistics/statistics'
      });
    }, 1500);
  }
})