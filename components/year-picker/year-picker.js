Component({
  properties: {
    show: {
      type: Boolean,
      value: false
    },
    value: {
      type: String,
      value: ''
    }
  },

  data: {
    years: [],
    pickerValue: [0],
    tempPickerValue: [0]
  },

  lifetimes: {
    attached() {
      this.initData();
    }
  },

  observers: {
    'value': function(newVal) {
      if (newVal) {
        this.updatePickerValue(newVal);
      }
    },
    'show': function(newVal) {
      if (newVal) {
        this.updatePickerValue(this.data.value);
      }
    }
  },

  methods: {
    initData() {
      const now = new Date();
      const startYear = 2018;
      const endYear = now.getFullYear() + 1;
      const years = [];
      for (let y = startYear; y <= endYear; y++) {
        years.push(y);
      }
      
      this.setData({ years });
    },

    updatePickerValue(monthStr) {
      const { years } = this.data;
      const parts = monthStr.split('-');
      const year = parseInt(parts[0]);
      
      const yearIndex = years.indexOf(year);
      
      this.setData({
        pickerValue: [yearIndex >= 0 ? yearIndex : 0],
        tempPickerValue: [yearIndex >= 0 ? yearIndex : 0]
      });
    },

    onMaskTap() {
      this.triggerEvent('cancel');
    },

    onCancel() {
      this.triggerEvent('cancel');
    },

    onConfirm() {
      const { years, tempPickerValue } = this.data;
      const selectedYear = years[tempPickerValue[0]];
      
      const yearStr = `${selectedYear}-01`;
      this.triggerEvent('confirm', { value: yearStr, year: selectedYear });
    },

    onPickerChange(e) {
      this.setData({
        tempPickerValue: e.detail.value
      });
    },

    stopPropagation() {}
  }
})
