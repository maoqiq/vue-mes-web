<template> 
  <a class="board-layout" @click="handleJumpMachineList">
    <el-card class="box-card" :body-style="{ padding: '14px 0 0' }">
      <div slot="header">
        <div style="margin:-18px -20px;" class="clearfix">
          <div class="title">第 {{item.machine_id}} 号机器</div>
          <div class="number">
            <span class="failed"
              :class="{
              'alarm-level-1':item.level==1,
              'alarm-level-2':item.level==2,
              'alarm-level-3':item.level==3}">
              {{item.sum}}</span>
          </div>
          <i class="el-icon-s-management"
            :class="{
            'alarm-level-1':item.level==1,
            'alarm-level-2':item.level==2,
            'alarm-level-3':item.level==3}"></i>
        </div>
      </div>
      <div class="chart">
        <ve-histogram
          ref="chart"
          height="240px"
          width="284px"
          :resize-delay="0"
          :data="chartData"
          :legend-visible="false"
          :loading="loading"
          :settings="chartSettings"
          :extend="extend"></ve-histogram>
      </div>
    </el-card>
  </a>
</template>
<script>
import store from '../../../store'
  const defaultParams = {
    machine_id: [],
    shift_id: null,
    start_time: '',
    end_time: '',
    page: 1,
    limit: 5
  }
  export default {
    name: 'BoardChart',
    props: ['item'],
    data() {
      return {
        chartType: '',
        chartData: {
          columns: [],
          rows: []
        },
        extend: {
          series: {
            label: { show: true, position: "top" },
            barMaxWidth: 26
          },

        },
        chartSettings: {
          scale:[true, false]
        },
        loading: false,
        dataEmpty: false,
        itemParams: Object.assign({}, defaultParams),
        dashboardTime:null
      }
    },
    created() {
      this.handleParams()
      this.initChartData()
    },
    mounted(){
      // this.initChartData()
    },
    watch: {
      chartType () {
        this.$nextTick(_ => {
          this.$refs[`chart`].echarts.resize()
        })
      },
      item: {
        handler (newValue, oldValue) {
          console.log(newValue)
        },
        deep: true // 默认值是 false，代表是否深度监听
      },
      chartData: {
        handler (newValue, oldValue) {
          // console.log(oldValue)
          // console.log(newValue)
        },
        deep: true // 默认值是 false，代表是否深度监听
      }
    },
    methods: {
      handleParams(){
        let self = this
        setTimeout(()=>{
          console.log(store)
          self.dashboardTime = store.getters.dashboardTime
          self.itemParams.start_time = store.getters.dashboardTime.start_time
          self.itemParams.end_time = store.getters.dashboardTime.end_time
        },1000)
        this.itemParams.machine_id = [];
        this.itemParams.machine_id.push(this.item.machine_id)
      },
      initChartData(){
        this.chartType = this.item.type+'值'
        this.chartData = {
          columns: ['批次', this.chartType],
          rows: []
        }
        this.item.shift.forEach(element => {
          for (const key in element) {
            if (element.hasOwnProperty(key)) {
              const chartElement = element[key];
              let rowsItem = {}
              rowsItem['批次'] = `${key}批次`
              rowsItem[this.chartType] = chartElement
              this.chartData.rows.push(rowsItem)
            }
          }
        });
        this.dataEmpty = false;
        this.loading = false
      },
      handleJumpMachineList(){
        console.log(this.dashboardTime)
        console.log(this.itemParams)
        this.$router.push({path:'/quality/machine',query:this.itemParams});
      }
    }
  }
</script>
<style rel="stylesheet/scss" lang="scss" scoped>
  .board-layout {
    pointer-events: auto;
    .box-card {
      position: relative;
      margin-bottom: 20px;
      padding: 14px;
      width: 20rem;
      .clearfix {
        display: flex;
        .title {
          padding: 6px 12px;
          background: #0079FE;
          color: #fff;
          font-size: 0.6rem;
          font-weight: bold;
        }
        .number {
          line-height: 25px;
          margin-left: 30px;
        }
        .el-icon-s-management {
          position: absolute;
          right: 20px;
          top: 0;
          font-size: 2rem;
        }
      }

    }
  }
  .no-data{
    color: #97a8be;
    text-align: center;
    display: flex;
    flex-direction: column;
    .el-icon-search{
      font-size: 50px;
      margin: 20px;
    }
  }
  .alarm-level-1{
    color: #ee2513;
  }
  .alarm-level-2{
    color: #FF9800;
  }
  .alarm-level-3{
    color: #fce24f;
  }
</style>


