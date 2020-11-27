<template> 
  <div class="board-layout">
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
          :resize-delay="0"
          :data="chartData"
          :legend-visible="false"
          :loading="loading"
          :settings="chartSettings"></ve-histogram>
      </div>
    </el-card>
  </div>
</template>
<script>

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
        chartSettings: {
          scale:[true, false]
        },
        loading: false,
        dataEmpty: false
      }
    },
    created() {
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
      initChartData(){
        setTimeout(() => {
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
                  rowsItem['批次'] = key
                  rowsItem[this.chartType] = chartElement
                  this.chartData.rows.push(rowsItem)
                }
              }
            });
            this.dataEmpty = false;
            this.loading = false
        }, 1000)
      }
    }
  }
</script>
<style rel="stylesheet/scss" lang="scss" scoped>
  .board-layout {
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


