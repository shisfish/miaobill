Page({
  data: {
    articles: [
      {
        id: 1,
        title: '如何制定合理的月度预算',
        desc: '掌握这些方法，让你的财务更健康',
        author: '财务专家',
        views: '2.5万阅读',
        image: '💰'
      },
      {
        id: 2,
        title: '家庭记账的5个实用技巧',
        desc: '让家庭财务更加透明和有序',
        author: '家庭理财师',
        views: '1.8万阅读',
        image: '🏠'
      },
      {
        id: 3,
        title: '年轻人如何开始投资',
        desc: '从小额投资开始，积累财富',
        author: '投资顾问',
        views: '3.2万阅读',
        image: '📈'
      }
    ],
    tools: [
      {
        id: 1,
        name: '理财计算器',
        icon: '📊'
      },
      {
        id: 2,
        name: '信用卡管理',
        icon: '💳'
      },
      {
        id: 3,
        name: '银行利率查询',
        icon: '🏦'
      },
      {
        id: 4,
        name: '购物清单',
        icon: '📋'
      }
    ],
    topics: [
      {
        id: 1,
        tag: '# 理财',
        title: '月入5000如何存钱？',
        count: '128人参与'
      },
      {
        id: 2,
        tag: '# 消费',
        title: '双11如何理性消费？',
        count: '256人参与'
      },
      {
        id: 3,
        tag: '# 投资',
        title: '新手如何选择基金？',
        count: '189人参与'
      }
    ]
  },
  
  onLoad: function () {
    console.log('Discover page loaded');
  },
  
  search: function() {
    wx.showToast({
      title: '搜索功能开发中',
      icon: 'none'
    });
  },
  
  viewArticle: function(e) {
    const articleId = e.currentTarget.dataset.id;
    wx.showToast({
      title: '文章详情页开发中',
      icon: 'none'
    });
  },
  
  useTool: function(e) {
    const toolId = e.currentTarget.dataset.id;
    wx.showToast({
      title: '工具开发中',
      icon: 'none'
    });
  },
  
  viewTopic: function(e) {
    const topicId = e.currentTarget.dataset.id;
    wx.showToast({
      title: '话题详情页开发中',
      icon: 'none'
    });
  },
  
  viewMoreArticles: function() {
    wx.showToast({
      title: '更多内容开发中',
      icon: 'none'
    });
  },
  
  viewMoreTools: function() {
    wx.showToast({
      title: '更多工具开发中',
      icon: 'none'
    });
  },
  
  viewMoreTopics: function() {
    wx.showToast({
      title: '更多话题开发中',
      icon: 'none'
    });
  }
})