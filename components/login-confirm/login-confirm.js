Component({
  properties: {
    show: {
      type: Boolean,
      value: false
    },
    title: {
      type: String,
      value: '需要登录'
    },
    content: {
      type: String,
      value: '请先登录以记账'
    }
  },
  methods: {
    onChooseAvatar(e) {
      this.triggerEvent('chooseavatar', e.detail);
    },
    onAvatarError(e) {
      // 捕获取消或其他错误，不做任何处理
      console.log('头像选择取消或失败:', e);
    },
    onCancel() {
      this.triggerEvent('cancel');
    },
    stopPropagation() {}
  }
});