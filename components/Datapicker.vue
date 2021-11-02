<template >
  <div>
    <DatePicker
      :disabled-date="disabledDate"
      v-model="dates"
      type="date"
      range
      value-type="timestamp"
      @clear="clear"
    />
  </div>
</template>
<script>
import DatePicker from 'vue2-datepicker'
import 'vue2-datepicker/index.css'
import 'vue2-datepicker/locale/ru'

// блокируем при двойном клике на текущей месяц переключение на следующей
const { updateCalendars } = DatePicker.CalendarRange.methods
DatePicker.CalendarRange.methods.updateCalendars = function (
  calendars,
  adjustIndex = 0
) {
  updateCalendars.call(this, calendars, adjustIndex)
}

export default {
  components: { DatePicker },
  props: {
    value: {
      type: Array,
      required: true,
    },
  },
  data() {
    return {
      date: '',
      pickDate: null,
    }
  },
  computed: {
    dates: {
      get() {
        return this.value
      },
      set(dates) {
        if (dates[0] === null) {
          dates = []
        }
        this.$emit('input', dates)
      },
    },
    defaultValue() {
      const previous = new Date()
      previous.setMonth(previous.getMonth() - 1)
      return [previous, new Date()]
    },
  },
  methods: {
    disabledDate(date) {
      return new Date() < date
    },
    clear() {
      this.$emit('clear')
    },
  },
}
</script>
<style lang="scss">
</style>