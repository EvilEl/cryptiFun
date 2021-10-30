<template>
  <div class="tool" ref="tool">
    <div class="tool__body" v-for="item in dataPoints" :key="item.label">
      <div class="tool__all-date">
        <div class="tool__date">
          <div class="tool__date-image">
            <img class="_image" src="@/assets/images/clock.png" alt />
          </div>
          {{time}}
        </div>
        <div class="tool__time">{{ date }}</div>
      </div>
      <div class="tool__price">
        {{label}}
        {{formatValue(item.value)}}
      </div>
    </div>
  </div>
</template>
<script>
import formatValue from '@/helpers/formatValues'

export default {
  props: {
    options: {
      type: Object,
      required: true,
    },
    label: {
      type: String,
      required: true,
    },
  },
  data() {
    return {
      formatValue,
      optionsTolltip: {},
      dataPoints: [],
    }
  },
  computed: {
    labelCrypto() {
      const a = this.cryptoCoin.find((item) => item.id === this.currentIdCrypto)
      if (a) {
        return a.name
      }
      return ''
    },
    time() {
      const d = new Date(this.dataPoints[0].xLabel * 1000)
      const arrD = [d.getHours(), d.getMinutes(), d.getSeconds()]
      return arrD
        .map(function (x) {
          return x < 10 ? '0' + x : x
        })
        .join(':')
    },
    date() {
      const d = new Date(this.dataPoints[0].xLabel * 1000)
      const arrD = [d.getDate(), d.getMonth() + 1, d.getFullYear()]
      return arrD
        .map(function (x) {
          return x < 10 ? '0' + x : x
        })
        .join(':')
    },
  },
  created() {
    this.optionsTolltip = this.options.tooltips
    this.optionsTolltip.custom = this.customTooltip
  },
  methods: {
    customTooltip(model) {
      const tooltipEl = this.$refs.tool
      const tooltipModel = model

      this.dataPoints = tooltipModel.dataPoints

      // вынести
      if (tooltipModel.opacity === 0) {
        tooltipEl.style.opacity = 0
        return false
      } else {
        const position =
          this.$parent.$refs.chart.$refs.canvas.getBoundingClientRect()
        tooltipEl.style.opacity = 1
        tooltipEl.style.position = 'absolute'
        tooltipEl.style.top = position.height / 2 + 'px'
        if (tooltipModel.caretX > 800) {
          tooltipEl.style.left = 'auto'
          tooltipEl.style.right =
            position.width - Math.round(tooltipModel.caretX) + 40 + 'px'
        } else {
          tooltipEl.style.left = position.left + tooltipModel.caretX + 60 + 'px'
          tooltipEl.style.right = 'auto'
        }
        tooltipEl.style.pointerEvents = 'none'
      }
    },
  },
}
</script>
<style lang="scss">
.tool {
  opacity: 0;
  font-size: 14px;
  font-family: 'Gill Sans', 'Gill Sans MT', Calibri, 'Trebuchet MS', sans-serif;
  font-weight: 500;
  color: #fff;
  &__all-date {
    background: rgba(46, 49, 49, 1);
    display: flex;
    padding: 4px 4px;
  }
  &__date-image {
    width: 24px;
    height: 24px;
    padding-right: 5px;
  }
  &__date {
    margin-right: 15px;
    display: flex;
    align-items: center;
  }
  &__time {
    font-size: 10px;
  }
  &__body {
    padding: 10px;
    background: rgba(46, 49, 49, 0.8);
  }
  &__price {
    margin-top: 15px;
    background: rgba(46, 49, 49, 1);
    padding: 2px 4px;
  }
}
</style>