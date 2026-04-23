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
    months: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
    pickerValue: [0, 0],
    tempPickerValue: [0, 0]
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

  lifetimes: {
    attached() {
      this.initData();
    }
  },

  methods: {
    initData() {
      const now = new Date();
      const startYear = 2018;
      const endYear = now.getFullYear() + 1;
      const years = [];
      for (let y = startYear; y <= endYear; y++) years.push(y);
      
      let currentValue = this.data.value;
      if (!currentValue) {
        currentValue = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
      }
      
      this.setData({ years });
      this.updatePickerValue(currentValue);
    },

    updatePickerValue(monthStr) {
      const { years, months } = this.data;
      const parts = monthStr.split('-');
      const year = parseInt(parts[0]);
      const month = parseInt(parts[1]);
      
      const yearIndex = years.indexOf(year);
      const monthIndex = months.indexOf(month);
      
      this.setData({
        pickerValue: [
          yearIndex >= 0 ? yearIndex : 0,
          monthIndex >= 0 ? monthIndex : 0
        ],
        tempPickerValue: [
          yearIndex >= 0 ? yearIndex : 0,
          monthIndex >= 0 ? monthIndex : 0
        ]
      });
    },

    onMaskTap() {
      this.triggerEvent('cancel');
    },

    onCancel() {
      this.triggerEvent('cancel');
    },

    onConfirm() {
      const { years, months, tempPickerValue } = this.data;
      const selectedYear = years[tempPickerValue[0]];
      const selectedMonth = months[tempPickerValue[1]];
      
      const monthStr = `${selectedYear}-${String(selectedMonth).padStart(2, '0')}`;
      this.triggerEvent('confirm', { value: monthStr, year: selectedYear, month: selectedMonth });
    },

    onPickerChange(e) {
      this.setData({
        tempPickerValue: e.detail.value
      });
    },

    stopPropagation() {}
  }
})
