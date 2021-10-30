<template>
  <div>
    <component
      :is="chartType"
      ref="chart"
      :styles="styles"
      :chartData="{labels:labels,datasets:datasets}"
      :options="options"
    ></component>
    <Tooltip ref="tooltip" :options="options" :label="labelCrypto" />
  </div>
</template>
<script>
import { DateTime } from 'luxon'
import Tooltip from '~/components/Tooltip.vue'
import ChartTypeLine from '@/components/Chart/ChartTypeLine.vue'
export default {
  components: { Tooltip, ChartTypeLine },
  props: {
    typeChart: {
      type: String,
      default: 'line',
    },
    labels: {
      type: Array,
      required: true,
    },
    datasets: {
      type: Array,
      required: true,
    },
    labelCrypto: {
      type: String,
      required: true,
    },
  },

  data() {
    return {
      DateTime,
      styles: {
        position: 'relative',
        height: `300px`,
        marginLeft: '-20px',
      },
      options: {},
      currentIdCrypto: 'btc-bitcoin',
    }
  },
  watch: {
    datasets() {
      this.options.scales.xAxes[0].afterBuildTicks = this.afterBuildTicks
    },
  },
  created() {
    this.initOptions()
    this.options.scales.xAxes[0].afterBuildTicks = this.afterBuildTicks
    this.options.scales.yAxes[0].ticks.callback = this.yAfterBuildTicks
  },
  computed: {
    chartType() {
      return this.typeChart ? 'ChartTypeLine' : ''
    },
  },
  mounted() {},
  methods: {
    // настройки chart
    initOptions() {
      this.options = {
        responsive: true,
        maintainAspectRatio: false,
        legend: {
          display: false,
        },
        tooltips: {
          intersect: false,
          mode: 'index',
          callbacks: {},
          enabled: false,
        },
        hover: {
          mode: 'index',
          intersect: false,
          animationDuration: 5,
        },
        elements: {
          line: {
            fill: true,
            tension: 0.2,
          },
          point: {
            hoverRadius: 2,
          },
        },
        scales: {
          xAxes: [
            {
              afterFit: (axis) => {
                axis.paddingLeft = 70
              },
              gridLines: {
                // рисует линию возле значений
                drawTicks: false,
                zeroLineColor: 'black',
              },
              ticks: {
                maxRotation: 0,
                padding: 10,
                maxTicksLimit: 6,
                beginAtZero: true,
                callbacks: {},
              },
            },
          ],

          yAxes: [
            {
              gridLines: {
                // рисует линию возле значений
                drawTicks: false,
              },
              ticks: {
                callback: {},
                padding: 10,
                maxTicksLimit: 6,
              },
            },
          ],
        },
      }
    },

    // формируем y ось
    yAfterBuildTicks(ticks) {
      return ticks + '$'
    },
    // формируем x ось
    afterBuildTicks(axis, ticks) {
      return ticks.map((item) => {
        return `${new Date(item * 1000).getDate()}/${new Date(
          item * 1000
        ).getMonth()}`
      })
    },
    getCrypto(id) {
      this.currentIdCrypto = id
      this.initCrypto(id)
    },
  },
}
</script>
<style lang="scss">
._image {
  width: 100%;
  height: 100%;
  object-fit: cover;
}
</style>