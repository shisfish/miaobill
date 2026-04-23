const { createRecord, getCategoriesByType, addCategory, deleteCategory } = require('../../utils/api');
const { isUserLoggedIn, performLoginWithAvatar } = require('../../utils/auth');

const DEFAULT_EXPENSE = [
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
];

const DEFAULT_INCOME = [
  { name: '工资', icon: '💰' },
  { name: '奖金', icon: '🏆' },
  { name: '兼职', icon: '💼' },
  { name: '理财', icon: '📈' },
  { name: '礼金', icon: '🧧' },
  { name: '报销', icon: '🧾' },
  { name: '退款', icon: '↩️' },
  { name: '其他', icon: '📦' }
];

Page({
  data: {
    type: 2,
    amount: '',
    selectedCategory: '',
    remark: '',
    date: '',
    dateDisplay: '今天',
    categories: [],
    keyboardVisible: false,
    showDatePicker: false,
    showLoginConfirm: false
  },

  onLoad() {
    const now = new Date();
    const todayStr = `${now.getFullYear()}-${String(now.getMonth()+1).padStart(2,'0')}-${String(now.getDate()).padStart(2,'0')}`;
    this.setData({
      date: todayStr,
      dateDisplay: '今天'
    });
    this.loadCategories();
  },

  onShow() {
    if (!isUserLoggedIn()) {
      this.setData({ showLoginConfirm: true });
      return;
    }
    if (!this.data.keyboardVisible) {
      this.setData({ keyboardVisible: true });
    }
  },

  onChooseAvatar(e) {
    const avatarUrl = e.detail && e.detail.avatarUrl;
    if (!avatarUrl) {
      console.log('未选择头像或取消选择');
      return;
    }

    performLoginWithAvatar(avatarUrl)
      .then(() => {
        this.setData({ showLoginConfirm: false });
        this.loadCategories();
        if (!this.data.keyboardVisible) {
          this.setData({ keyboardVisible: true });
        }
      })
      .catch(err => {
        if (err.message !== '用户取消登录') {
          console.error('登录失败:', err);
        }
      });
  },

  onLoginCancel() {
    this.setData({ showLoginConfirm: false });
    wx.switchTab({ url: '/pages/index/index' });
  },

  loadCategories() {
    const type = this.data.type === 2 ? 'expense' : 'income';

    getCategoriesByType(type)
      .then(res => {
        if (res && res.length > 0) {
          this.setData({
            categories: res,
            selectedCategory: res[0].name
          });
        } else {
          this.initDefaultCategories(type);
        }
      })
      .catch(() => {
        this.initDefaultCategories(type);
      });
  },

  initDefaultCategories(type) {
    const defaults = type === 'expense' ? DEFAULT_EXPENSE : DEFAULT_INCOME;
    this.setData({
      categories: defaults,
      selectedCategory: defaults[0].name
    });
    defaults.forEach((cat, idx) => {
      addCategory({
        name: cat.name,
        icon: cat.icon,
        type: type,
        sortOrder: idx + 1,
        isDefault: 1
      }).catch(() => {});
    });
  },

  switchType(e) {
    const type = parseInt(e.currentTarget.dataset.type);
    this.setData({ type, selectedCategory: '' });
    this.loadCategories();
  },

  showKeyboard() {
    this.setData({ keyboardVisible: true });
  },

  selectCategory(e) {
    if (!isUserLoggedIn()) {
      this.setData({ showLoginConfirm: true });
      return;
    }
    this.setData({ selectedCategory: e.currentTarget.dataset.category });
    if (!this.data.keyboardVisible) {
      this.setData({ keyboardVisible: true });
    }
  },

  hideKeyboard() {
    this.setData({ keyboardVisible: false });
  },

  stopPropagation() {},

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
    this.setData({ showDatePicker: true });
  },

  onDateConfirm(e) {
    const selectedDate = e.detail.value;
    const now = new Date();
    const todayStr = `${now.getFullYear()}-${String(now.getMonth()+1).padStart(2,'0')}-${String(now.getDate()).padStart(2,'0')}`;
    
    let dateDisplay;
    if (selectedDate === todayStr) {
      dateDisplay = '今天';
    } else {
      const selectedDateObj = new Date(selectedDate);
      dateDisplay = `${selectedDateObj.getMonth() + 1}月${selectedDateObj.getDate()}日`;
    }
    
    this.setData({
      date: selectedDate,
      dateDisplay: dateDisplay,
      showDatePicker: false
    });
  },

  onDateCancel() {
    this.setData({ showDatePicker: false });
  },

  goBack() {
    wx.switchTab({ url: '/pages/statistics/statistics' });
  },

  saveRecord() {
    if (!isUserLoggedIn()) {
      this.setData({ showLoginConfirm: true });
      return;
    }

    let amtStr = this.data.amount;
    if (!amtStr) {
      wx.showToast({ title: '请输入金额', icon: 'none' }); return;
    }

    let finalAmt = 0;
    try {
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
      type: this.data.type === 2 ? 'expense' : 'income',
      amount: finalAmt.toFixed(2),
      category: this.data.selectedCategory,
      description: this.data.remark,
      date: this.data.date,
      createTime: new Date().toISOString().replace('T', ' ').substring(0, 19)
    };

    createRecord(record)
      .then(() => {
        wx.showToast({ title: '已保存', icon: 'success' });
        setTimeout(() => {
          this.setData({ amount: '', remark: '', keyboardVisible: false });
          wx.switchTab({
            url: '/pages/statistics/statistics',
            success: () => {
              const pages = getCurrentPages();
              const targetPage = pages[pages.length - 1];
              if (targetPage && targetPage.loadRecords) {
                targetPage.loadRecords();
              }
            }
          });
        }, 1200);
      })
      .catch(err => {
        console.error('保存记录失败:', err);
      });
  },

  onUnload() {
  }
});
