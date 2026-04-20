Component({
  properties: {
    bottom: {
      type: String,
      value: '72rpx'
    }
  },

  methods: {
    onTap() {
      this.triggerEvent('tap');
    }
  }
});
