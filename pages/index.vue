<template>
  <div>
    <Tabs :tabsItems="cryptoCoin" @actionBtn="getCrypto" />
    <Chart
      ref="chart"
      v-if="loading"
      :styles="styles"
      :chartData="{labels:labels,datasets:datasets}"
      :options="options"
    ></Chart>
    <Tooltip ref="tooltip" :options="options" :label="labelCrypto" />
  </div>
</template>

<script>
import { DateTime } from 'luxon'
import Chart from '@/components/Chart'
import Tooltip from '~/components/Tooltip.vue'
import Tabs from '~/components/Tabs.vue'
export default {
  components: { Chart, Tooltip, Tabs },
  data() {
    return {
      DateTime,
      styles: {
        position: 'relative',
        height: `300px`,
        marginLeft: '-20px',
      },
      loading: false,
      bitcon: [],
      labels: [],
      datasets: [],
      options: {},
      cryptoCoin: [],
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
    this.initCryptoCoin()
    this.initCrypto()
  },
  computed: {
    labelCrypto() {
      const a = this.cryptoCoin.find((item) => item.id === this.currentIdCrypto)
      if (a) {
        return a.name
      }
      return ''
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
                maxTicksLimit: 4,
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
    // иницилизурем валюты
    async initCryptoCoin() {
      const response = await this.$axios.$get(
        'https://api.coinpaprika.com/v1/coins'
      )
      const data = response.slice(0, 5)
      this.cryptoCoin = data.map((item) => {
        return {
          id: item.id,
          name: item.name,
        }
      })
    },
    // иницилизурем график с криптой
    async initCrypto(name = 'btc-bitcoin') {
      this.loading = false

      const result = await this.$axios.$get(
        `https://api.coinpaprika.com/v1/tickers/${name}/historical`,
        {
          params: {
            start: 1634759748,
            end: 1635191748,
            limit: 1000,
            quote: 'usd',
            interval: '5m',
          },
          headers: {
            Accept: 'application/json',
          },
        }
      )
      this.bitcon = result.map((item) => {
        return item.price
      })

      this.labels = result.map((item) => {
        return new Date(item.timestamp).getTime() / 1000
      })
      this.datasets = [
        {
          label: 'bitcoin',
          data: this.bitcon,
          backgroundColor: 'rgba(53, 171, 84, 0.10)',
          borderColor: 'rgba(53, 171, 84, 0.40)',
          borderWidth: 1,
          pointBorderColor: 'rgba(0, 0, 0, 0)',
          pointBackgroundColor: 'rgba(0, 0, 0, 0)',
          pointHoverBackgroundColor: 'rgba(56, 181, 84, 1)',
          pointHoverBorderColor: 'rgba(56, 181, 84, 1)',
        },
      ]
      this.loading = true
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