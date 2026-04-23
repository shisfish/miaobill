Component({
  properties: {
    show: {
      type: Boolean,
      value: false
    },
    mode: {
      type: String,
      value: 'date'
    },
    value: {
      type: String,
      value: ''
    }
  },

  data: {
    years: [],
    months: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
    days: [],
    pickerValue: [0, 0, 0],
    tempPickerValue: [0, 0, 0]
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
        currentValue = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
      }
      
      this.setData({ years });
      this.updatePickerValue(currentValue);
    },

    updatePickerValue(dateStr) {
      const { years, months } = this.data;
      const date = new Date(dateStr);
      const year = date.getFullYear();
      const month = date.getMonth() + 1;
      const day = date.getDate();
      
      const yearIndex = years.indexOf(year);
      const monthIndex = months.indexOf(month);
      const days = this.getDaysInMonth(year, month);
      const dayIndex = days.indexOf(day);
      
      this.setData({
        days,
        pickerValue: [
          yearIndex >= 0 ? yearIndex : 0,
          monthIndex >= 0 ? monthIndex : 0,
          dayIndex >= 0 ? dayIndex : 0
        ],
        tempPickerValue: [
          yearIndex >= 0 ? yearIndex : 0,
          monthIndex >= 0 ? monthIndex : 0,
          dayIndex >= 0 ? dayIndex : 0
        ]
      });
    },

    getDaysInMonth(year, month) {
      const days = new Date(year, month, 0).getDate();
      const result = [];
      for (let d = 1; d <= days; d++) result.push(d);
      return result;
    },

    onMaskTap() {
      this.triggerEvent('cancel');
    },

    onCancel() {
      this.triggerEvent('cancel');
    },

    onConfirm() {
      const { years, months, days, tempPickerValue } = this.data;
      const selectedYear = years[tempPickerValue[0]];
      const selectedMonth = months[tempPickerValue[1]];
      const selectedDay = days[tempPickerValue[2]];
      
      const dateStr = `${selectedYear}-${String(selectedMonth).padStart(2, '0')}-${String(selectedDay).padStart(2, '0')}`;
      this.triggerEvent('confirm', { value: dateStr });
    },

    onPickerChange(e) {
      const newValue = e.detail.value;
      const { years, months } = this.data;
      
      const newYear = years[newValue[0]];
      const newMonth = months[newValue[1]];
      const newDays = this.getDaysInMonth(newYear, newMonth);
      
      let newDayIndex = newValue[2];
      if (newDayIndex >= newDays.length) {
        newDayIndex = newDays.length - 1;
      }
      
      this.setData({
        days: newDays,
        tempPickerValue: [newValue[0], newValue[1], newDayIndex]
      });
    },

    stopPropagation() {}
  }
})
