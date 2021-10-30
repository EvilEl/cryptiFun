<template>
  <div>
    <div class="navigation">
      <Datapicker @confirmDates="confirmDates" v-model="dates" />
      <Tabs :tabsItems="cryptoCoin" @actionBtn="getCrypto" />
      <Tabs :tabsItems="cryptoCoin" @actionBtn="getCrypto" />
    </div>
    <Chart :datasets="datasets" :labels="labels" v-if="loading" :labelCrypto="labelCrypto"></Chart>
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
      loading: false,
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
      const timeDiff = Math.abs(
        new Date(this.formadDates[0]).getTime() -
          new Date(this.formadDates[1]).getTime()
      )
      return Math.ceil(timeDiff / (1000 * 3600 * 24))
    },
    formadDates() {
      return this.dates.map((item) => {
        console.log(new Date(item).getTime() / 1000)
        return item
      })
    },
  },
  methods: {
    confirmDates(value) {
      this.dates = value
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
      const prevDay = DateTime.now()
      let prevD = prevDay.minus({ days: 1 })
      console.log()
      const result = await this.$axios.$get(
        `https://api.coinpaprika.com/v1/tickers/${name}/historical`,
        {
          params: {
            start: this.formadDates[0] || (prevD.ts / 1000).toFixed(),
            end: this.formadDates[1],
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
      this.loading = true
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