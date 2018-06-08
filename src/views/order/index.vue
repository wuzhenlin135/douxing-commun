<template>
  <div class="app-container calendar-list-container">

    <div class="filter-container">
      <el-select clearable style="width: 140px" class="filter-item" v-model="listQuery.scenicId" placeholder="选择景区">
        <el-option v-for="item in scenicesOptions" :key="item.key" :label="item.label" :value="item.key">
        </el-option>
      </el-select>
      <el-select clearable style="width: 140px" class="filter-item" v-model="listQuery.status" placeholder="选择状态">
        <el-option v-for="item in statusOptions" :key="item.key" :label="item.label" :value="item.key">
        </el-option>
      </el-select>
      <el-date-picker class="filter-item" v-model="fitlerTime"  type="datetimerange"
        range-separator="至" value-format="timestamp" start-placeholder="开始日期" end-placeholder="结束日期">
      </el-date-picker>
      <el-button class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">{{$t('order.search')}}</el-button>
      <el-button class="filter-item" type="primary" :loading="downloadLoading"  icon="el-icon-download" @click="handleDownload">{{$t('order.export')}}</el-button>
    </div>

    <el-table :key='tableKey' :data="list" v-loading="listLoading" element-loading-text="给我一点时间"
      border fit highlight-current-row style="width: 100%">
      <el-table-column align="center" :label="$t('order.orderId')" width="65">
        <template slot-scope="scope">
          <span>{{scope.row.id}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" :label="$t('order.orderNumber')" width="180px">
        <template slot-scope="scope">
          <span>{{scope.row.orderNumber}}</span>
        </template>
      </el-table-column>
      <el-table-column min-width="170px" align="center" :label="$t('order.createTime')">
        <template slot-scope="scope">
          <span>{{scope.row.transtime | parseTime('{y}-{m}-{d} {h}:{i}:{s}')}}</span>
        </template>
      </el-table-column>
      <el-table-column width="130px" align="center" :label="$t('order.scenic')">
        <template slot-scope="scope">
          <span>{{scope.row.scenicTitle}}</span>
        </template>
      </el-table-column>
      <el-table-column min-width="150px" align="center" :label="$t('order.product')">
        <template slot-scope="scope">
          <span>{{scope.row.productTitle}}</span>
        </template>
      </el-table-column>
      <el-table-column width="110px" align="center" :label="$t('order.count')">
        <template slot-scope="scope">
          <span>{{scope.row.count}}</span>
        </template>
      </el-table-column>
      <el-table-column width="110px" align="center" :label="$t('order.price')">
        <template slot-scope="scope">
          <span>￥{{scope.row.price}}</span>
        </template>
      </el-table-column>
      <el-table-column width="130px" align="center" :label="$t('order.commun')">
        <template slot-scope="scope">
          <span>{{scope.row.communTitle}}</span>
        </template>
      </el-table-column>
      <el-table-column min-width="160px" align="left" :label="$t('order.contactInfo')">
        <template slot-scope="scope">
          <span>姓名：{{scope.row.userName}}</span>
           <br/>
          <span>电话：{{scope.row.userPhone}}</span>
        </template>
      </el-table-column>
      <el-table-column min-width="180px" align="left" :label="$t('order.locationTime')">
        <template slot-scope="scope">
          <span>地点：{{scope.row.location}}</span>
           <br/>
          <span>时间：{{scope.row.datetime}}</span>
        </template>
      </el-table-column>
      <el-table-column class-name="status-col" :label="$t('order.status')" width="100">
        <template slot-scope="scope">
          <el-tag :type="scope.row.status | statusFilter">{{scope.row.statusLabel}}</el-tag>
        </template>
      </el-table-column>
    </el-table>

    <div class="pagination-container">
      <el-pagination background @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="listQuery.pageNo"
       :page-sizes="[10,20,30, 50]" :page-size="listQuery.pageSize" layout="total, sizes, prev, pager, next, jumper" :total="total">
      </el-pagination>
    </div>

  </div>

</template>

<script>
import { getList, getFitlers } from '@/api/order'
import { parseTime } from '@/utils'

export default {
  data() {
    return {
      tableKey: 0,
      list: null,
      total: null,
      listLoading: true,
      fitlerLoading: true,
      downloadLoading: false,
      fitlerTime: [],
      listQuery: {
        pageNo: 1,
        pageSize: 20,
        scenicId: undefined,
        communId: undefined,
        status: undefined,
        beginTime: undefined,
        endTime: undefined
      },
      scenicesOptions: [],
      communsOptions: [],
      statusOptions: []
    }
  },
  watch: {
    fitlerTime: function(newFitlerTime) {
      if (newFitlerTime !== null) {
        this.listQuery.beginTime = newFitlerTime[0] / 1000
        this.listQuery.endTime = newFitlerTime[1] / 1000
      } else {
        this.listQuery.beginTime = undefined
        this.listQuery.endTime = undefined
      }
    }
  },
  filters: {
    statusFilter(status) {
      const statusMap = {
        0: 'info',
        1: 'warning',
        2: '',
        3: 'danger',
        4: 'success'
      }
      return statusMap[status]
    }
  },

  created() {
    this.fetchFitlers()
    this.fetchList()
  },

  methods: {
    fetchList() {
      this.listLoading = true
      getList(this.listQuery).then(response => {
        this.list = response.list
        this.total = response.map.count
        this.listLoading = false
      })
    },
    fetchFitlers() {
      this.fitlerLoading = true
      getFitlers().then(response => {
        this.scenicesOptions = response.obj.scenicesOptions
        this.statusOptions = response.obj.statusOptions
        this.listLoading = false
      })
    },
    handleFilter() {
      this.listQuery.pageNo = 1
      this.fetchList()
    },
    handleSizeChange(val) {
      this.listQuery.pageSize = val
      this.fetchList()
    },
    handleCurrentChange(val) {
      this.listQuery.pageNo = val
      this.fetchList()
    },
    handleDownload() {
      if (!this.list) {
        this.$message({ message: '没有可以导出的数据', type: 'warning' })
        return
      }
      this.downloadLoading = true
      import('@/vendor/Export2Excel').then(excel => {
        const tHeader = ['ID', '订单号', '交易时间', '景区', '商品', '数量', '金额', '客栈', '联系方式', '时间地点', '状态']
        const filterVal = ['id', 'orderNumber', 'transtime', 'scenicTitle', 'productTitle', 'count', 'price', 'communTitle', 'userName', 'location', 'statusLabel']
        const data = this.formatJson(filterVal, this.list)
        excel.export_json_to_excel({
          header: tHeader,
          data,
          filename: 'table-list'
        })
        this.downloadLoading = false
      })
    },
    formatJson(filterVal, jsonData) {
      return jsonData.map(v => filterVal.map(j => {
        if (j === 'transtime') {
          return parseTime(v[j])
        } else if (j === 'userName') {
          return '姓名：' + v[j] + ',\r\n电话：' + v['userPhone']
        } else if (j === 'location') {
          return '地点：' + v[j] + ',\r\n时间：' + v['datetime']
        } else {
          return v[j]
        }
      }))
    }
  }
}
</script>
