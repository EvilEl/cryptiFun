<template>
  <div class="tabs">
    <div class="tabs__item" v-for="item in tabsItems" :key="item.id">
      <button
        class="tabs__btn"
        :class="[item.id===idActiveTab?'active':'']"
        @click="actionBtn(item.id)"
      >{{item.name}}</button>
    </div>
  </div>
</template>
<script>
export default {
  data() {
    return {
      idActiveTab: 'btc-bitcoin',
    }
  },
  props: {
    tabsItems: {
      type: Array,
      required: true,
    },
  },
  methods: {
    actionBtn(id) {
      this.idActiveTab = id
      this.$emit('actionBtn', id)
    },
  },
}
</script>
<style lang="scss">
.tabs {
  margin-bottom: 20px;
  margin-left: 50px;
  display: flex;
  & > *:not(:last-child) {
    margin-right: 10px;
  }
  &__btn {
    width: 100px;
    display: flex;
    align-items: center;
    padding: 10px 5px;
    background: #00ccff;
    border: none;
    border-radius: 5px;
    opacity: 0.6;
    transition: all 0.2s linear;
    &:hover {
      background: #3399cc;
    }
    &.active {
      background: #006699;
    }
  }
}
</style>