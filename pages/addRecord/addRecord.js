Page({
  data: {
    type: 2,
    amount: '',
    selectedCategory: '',
    remark: '',
    date: '',
    categories: [],
    keyboardVisible: false,
    
    expenseCategories: [
      { name: '餐饮', icon: '🍴' },
      { name: '购物', icon: '🛍' },
      { name: '日用', icon: '🧻' },
      { name: '交通', icon: '🚌' },
      { name: '蔬菜', icon: '🥕' },
      { name: '水果', icon: '🍎' },
      { name: '零食', icon: '🍰' },
      { name: '运动', icon: '🚴' },
      { name: '娱乐', icon: '🎤' },
      { name: '通讯', icon: '📞' },
      { name: '服饰', icon: '👕' },
      { name: '美容', icon: '💄' },
      { name: '住房', icon: '🏠' },
      { name: '居家', icon: '🛋' },
      { name: '孩子', icon: '👶' },
      { name: '长辈', icon: '👴' },
      { name: '社交', icon: '💬' },
      { name: '旅行', icon: '✈️' },
      { name: '烟酒', icon: '🍺' },
      { name: '数码', icon: '📱' },
      { name: '汽车', icon: '🚗' },
      { name: '医疗', icon: '💊' },
      { name: '书籍', icon: '📖' },
      { name: '水电', icon: '⚡' },
      { name: '保险', icon: '❤' },
      { name: '学习', icon: '🎓' },
      { name: '宠物', icon: '🐶' },
      { name: '礼金', icon: '🧧' },
      { name: '其他', icon: '📦' }
    ],
    incomeCategories: [
      { name: '工资', icon: '💰' },
      { name: '奖金', icon: '🎁' },
      { name: '投资', icon: '📈' },
      { name: '兼职', icon: '💼' },
      { name: '红包', icon: '🧧' },
      { name: '转账', icon: '💸' },
      { name: '退款', icon: '↩️' },
      { name: '其他收入', icon: '📦' }
    ]
  },

  onLoad() {
    const now = new Date();
    this.setData({
      date: `${now.getFullYear()}-${String(now.getMonth()+1).padStart(2,'0')}-${String(now.getDate()).padStart(2,'0')}`,
      categories: this.data.expenseCategories,
      selectedCategory: '餐饮'
    });
  },

  switchType(e) {
    const type = parseInt(e.currentTarget.dataset.type);
    this.setData({
      type,
      categories: type === 1 ? this.data.incomeCategories : this.data.expenseCategories,
      selectedCategory: type === 1 ? '工资' : '餐饮'
    });
  },

  selectCategory(e) {
    this.setData({ selectedCategory: e.currentTarget.dataset.category });
    if (!this.data.keyboardVisible) {
      this.setData({ keyboardVisible: true });
    }
  },

  showKeyboard() {
    this.setData({ keyboardVisible: true });
  },

  hideKeyboard() {
    this.setData({ keyboardVisible: false });
  },

  stopPropagation() {},

  // 新键盘输入
  pressKey(e) {
    if (!this.data.keyboardVisible) {
      this.setData({ keyboardVisible: true });
    }
    const key = e.currentTarget.dataset.key;
    let amt = this.data.amount;

    if (key === '.' && amt.includes('.')) return;
    if (amt === '0' && key !== '.') amt = '';
    if (key === '.' && !amt) amt = '0';

    const dotIdx = amt.indexOf('.');
    if (dotIdx !== -1 && amt.length - dotIdx > 2) return;

    this.setData({ amount: amt + key });
  },

  delKey() {
    let a = this.data.amount;
    if (a) this.setData({ amount: a.slice(0, -1) });
  },

  onRemarkInput(e) {
    this.setData({ remark: e.detail.value });
  },

  pickDate() {
    wx.showModal({
      title: '选择日期',
      content: `当前日期：${this.data.date}`,
      showCancel: false
    });
  },

  goBack() {
    wx.switchTab({ url: '/pages/statistics/statistics' });
  },

  saveRecord() {
    let amtStr = this.data.amount;
    if (!amtStr) {
      wx.showToast({ title: '请输入金额', icon: 'none' }); return;
    }

    // 计算金额
    let finalAmt = 0;
    try {
      // 处理加减法
      const parts = amtStr.split(/([+-])/);
      if (parts.length > 0) {
        finalAmt = parseFloat(parts[0] || 0);
        for (let i = 1; i < parts.length; i += 2) {
          const op = parts[i];
          const val = parseFloat(parts[i+1] || 0);
          if (op === '+') finalAmt += val;
          else if (op === '-') finalAmt -= val;
        }
      }
    } catch (e) {
      wx.showToast({ title: '金额计算错误', icon: 'none' }); return;
    }

    if (finalAmt <= 0) {
      wx.showToast({ title: '请输入大于0的金额', icon: 'none' }); return;
    }
    if (!this.data.selectedCategory) {
      wx.showToast({ title: '请选分类', icon: 'none' }); return;
    }

    const record = {
      id: Date.now(),
      type: this.data.type,
      amount: finalAmt.toFixed(2),
      category: this.data.selectedCategory,
      remark: this.data.remark,
      date: this.data.date,
      time: new Date().toTimeString().slice(0,5)
    };

    const records = wx.getStorageSync('records') || [];
    records.unshift(record);
    wx.setStorageSync('records', records);

    wx.showToast({ title: '已保存', icon: 'success' });

    setTimeout(() => {
      this.setData({ amount: '', remark: '', keyboardVisible: false });
      wx.switchTab({ url: '/pages/statistics/statistics' });
    }, 1200);
  }
});
