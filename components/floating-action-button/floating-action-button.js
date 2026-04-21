Component({
  properties: {
    size: {
      type: Number,
      value: 112
    },
    color: {
      type: String,
      value: '#FFD54F'
    },
    hidden: {
      type: Boolean,
      value: false
    }
  },
  methods: {
    handleTap() {
      this.triggerEvent('tap');
    }
  }
})