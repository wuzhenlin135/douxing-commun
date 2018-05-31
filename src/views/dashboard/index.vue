<template>
  <div class="dashboard-container">
    <panel-group @handleSetLineChartData="handleSetLineChartData" :orderCount="orderCount" :priceCount="priceCount"></panel-group>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import PanelGroup from './components/PanelGroup'
import { getStatistics } from '@/api/statistics'

export default {
  name: 'dashboard',
  data() {
    return {
      orderCount: 0,
      priceCount: 0
    }
  },
  computed: {
    ...mapGetters([
      'name',
      'roles'
    ])
  },
  created() {
    this.GetStatistics()
  },
  components: {
    PanelGroup
  },
  methods: {
    GetStatistics() {
      getStatistics().then(response => {
        this.orderCount = response.obj.orderCount
        this.priceCount = response.obj.priceCount
      })
    },
    handleSetLineChartData(type) {
      console.log(type)
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
.dashboard {
  &-container {
    margin: 30px;
  }
  &-text {
    font-size: 30px;
    line-height: 46px;
  }
}
</style>
