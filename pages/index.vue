<template>
  <div>
    <div class="navigation">
      <Datapicker v-model="dates" @clear="clearCalendar" />
      <Tabs :tabsItems="cryptoCoin" @actionBtn="getCrypto" />
    </div>
    <Chart :datasets="datasets" :labels="labels" :labelCrypto="labelCrypto"></Chart>
  </div>
</template>

<script>
import { DateTime } from 'luxon'
import Chart from '@/components/Chart/Chart'
import Tabs from '~/components/Tabs.vue'
import Datapicker from '~/components/Datapicker.vue'

export default {
  components: { Chart, Tabs, Datapicker },
  data() {
    return {
      DateTime,
      styles: {
        position: 'relative',
        height: `300px`,
        marginLeft: '-20px',
      },
      dates: [],
      bitcon: [],
      labels: [],
      datasets: [],
      cryptoCoin: [],
      currentIdCrypto: 'btc-bitcoin',
    }
  },

  created() {
    this.initCryptoCoin()
    this.initCrypto()
  },
  watch: {
    formadDates() {
      this.initCrypto()
    },
  },
  computed: {
    labelCrypto() {
      const a = this.cryptoCoin.find((item) => item.id === this.currentIdCrypto)
      if (a) {
        return a.name
      }
      return ''
    },
    interval() {
      if (this.diffDays >= 16) {
        return '1d'
      }
      if (this.diffDays < 16) {
        return '3h'
      }
      if (this.diffDays < 10) {
        return '1h'
      }
      if (this.diffDays < 5) {
        return '30m'
      }
      return '5m'
    },
    diffDays() {
      const timeDiff = this.formadDates[1] - this.formadDates[0]
      return Math.ceil(timeDiff / (24 * 60 * 60))
    },
    formadDates() {
      if (this.dates.length) {
        const date = this.dates.map((item) => item / 1000)
        date[1] = date[1] + 60 * 60 * 24 - 1
        return date
      }
      return []
    },
  },
  methods: {
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
      const startDay = (new Date().setHours(0, 0, 0, 0) / 1000).toFixed()
      const [from = startDay, to] = this.formadDates
      const result = await this.$axios.$get(
        `https://api.coinpaprika.com/v1/tickers/${name}/historical`,
        {
          params: {
            start: from,
            end: to,
            limit: 5000,
            quote: 'usd',
            interval: this.interval || '5m',
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
    },
    clearCalendar() {
      this.formadDates[0] = (new Date().setHours(0, 0, 0, 0) / 1000).toFixed()
      console.log(this.formadDates)
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
.navigation {
  display: flex;
}
</style>