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
    weeks: [],
    pickerValue: [0, 0],
    tempPickerValue: [0, 0]
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
      this.updateWeeks(now.getFullYear());
    },

    updateWeeks(year) {
      const weeks = [];
      const firstDay = new Date(year, 0, 1);
      const lastDay = new Date(year, 11, 31);
      
      let weekNum = 1;
      let current = new Date(firstDay);
      
      while (current <= lastDay) {
        const startOfWeek = new Date(current);
        startOfWeek.setDate(current.getDate() - current.getDay());
        
        if (startOfWeek.getFullYear() === year || current.getFullYear() === year) {
          weeks.push(weekNum);
          weekNum++;
        }
        
        current.setDate(current.getDate() + 7);
      }
      
      this.setData({ weeks });
    },

    updatePickerValue(dateStr) {
      const { years } = this.data;
      const date = new Date(dateStr);
      const year = date.getFullYear();
      
      const yearIndex = years.indexOf(year);
      this.updateWeeks(year);
      
      const weekNum = this.getWeekNumber(date);
      const weekIndex = weekNum - 1;
      
      this.setData({
        pickerValue: [yearIndex >= 0 ? yearIndex : 0, weekIndex >= 0 ? weekIndex : 0],
        tempPickerValue: [yearIndex >= 0 ? yearIndex : 0, weekIndex >= 0 ? weekIndex : 0]
      });
    },

    getWeekNumber(date) {
      const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
      const dayNum = d.getUTCDay() || 7;
      d.setUTCDate(d.getUTCDate() + 4 - dayNum);
      const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
      return Math.ceil((((d - yearStart) / 86400000) + 1) / 7);
    },

    onMaskTap() {
      this.triggerEvent('cancel');
    },

    onCancel() {
      this.triggerEvent('cancel');
    },

    onConfirm() {
      const { years, weeks, tempPickerValue } = this.data;
      const selectedYear = years[tempPickerValue[0]];
      const selectedWeek = weeks[tempPickerValue[1]];
      
      const date = this.getDateFromWeek(selectedYear, selectedWeek);
      const dateStr = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
      
      this.triggerEvent('confirm', { value: dateStr });
    },

    getDateFromWeek(year, week) {
      const firstDay = new Date(year, 0, 1);
      const dayOfWeek = firstDay.getDay() || 7;
      const firstMonday = new Date(firstDay);
      if (dayOfWeek > 1) {
        firstMonday.setDate(firstDay.getDate() + (8 - dayOfWeek));
      }
      
      const targetDate = new Date(firstMonday);
      targetDate.setDate(firstMonday.getDate() + (week - 1) * 7);
      
      return targetDate;
    },

    onPickerChange(e) {
      const newValue = e.detail.value;
      const { years } = this.data;
      
      const newYear = years[newValue[0]];
      this.updateWeeks(newYear);
      
      this.setData({
        tempPickerValue: newValue
      });
    },

    stopPropagation() {}
  }
})
