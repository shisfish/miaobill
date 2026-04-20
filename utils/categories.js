const expenseCategories = [
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

const categoryIconMap = expenseCategories.reduce((map, item) => {
  map[item.name] = item.icon;
  return map;
}, {});

function getCategoryIcon(name) {
  return categoryIconMap[name] || '📦';
}

module.exports = {
  expenseCategories,
  categoryIconMap,
  getCategoryIcon
};
