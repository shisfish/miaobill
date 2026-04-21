Component({
  properties: {
    size: {
      type: Number,
      value: 112
    },
    color: {
      type: String,
      value: '#FFD54F'
    }
  },
  methods: {
    handleTap() {
      this.triggerEvent('tap');
    }
  }
})