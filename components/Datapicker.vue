<template >
  <div>
    <DatePicker confirm v-model="dates" type="date" range @confirm="confirmDates" />
  </div>
</template>
<script>
import DatePicker from 'vue2-datepicker'
import 'vue2-datepicker/index.css'
import 'vue2-datepicker/locale/ru'

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
    }
  },
  computed: {
    dates: {
      get() {
        return this.value
      },
      set(dates) {
        this.$emit('input', dates)
      },
    },
  },
  methods: {
    confirmDates(value) {
      this.$emit('confirmDates', value)
    },
  },
}
</script>
<style lang="scss">
</style>