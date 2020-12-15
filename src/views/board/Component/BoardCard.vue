<template> 
  <a class="board-layout" @click="jumpToMachineList">
    <el-card class="box-card" :body-style="{ padding: '14px 0 0', height: '200px' }">
      <div slot="header">
        <div style="margin:-18px -20px;" class="clearfix">
          <div class="title">{{item.machine_id}} 号纺机</div>
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
      <div class="text-center">
        <div class="item" v-for="spindle in spindleList" :key="spindle.key">
          {{spindle.key}}: {{spindle.value}}
        </div>
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
    name: 'BoardCard',
    props: ['item'],
    data() {
      return {
        itemParams: Object.assign({}, defaultParams),
        spindleList: [],
        dashboardTime: null
      }
    },
    created() {
      console.log(this.item)
      this.handleParams()
      this.handleSpindle()
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
        console.log(this.dashboardTime)
        this.itemParams.machine_id = [];
        this.itemParams.machine_id.push(this.item.machine_id)
      },
      handleSpindle(){
        this.spindleList = []
        this.item.rot_id.forEach(element => {
          console.log(element)
          for (const key in element) {
                if (element.hasOwnProperty(key)) {
                  let spindleItem = {}
                  spindleItem.key = key
                  spindleItem.value = element[key]
                  this.spindleList.push(spindleItem)
                }
              }
        });
      },
      jumpToMachineList(){
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
      .text-center{
        display: flex;
        flex-wrap: wrap;
        justify-content: flex-start;
        .item {
          background: #999999;
          padding: 2px 8px;
          margin: 8px;
          color: #fff;
        }
      }
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


