<template> 
  <div class="app-container">
    <div class="board-layout">
      <el-row :gutter="20">
        <el-col class="no-data" v-if="!listData">
          <i class="el-icon-search"></i>
          暂无数据
        </el-col>
        <el-col v-else :span="6" v-for="(item,index) in listData"
            :key="index">
          <el-card class="box-card" :body-style="{ padding: '14px 0 0' }">
            <div slot="header">
              <div style="margin:-18px -20px;" class="clearfix">
                <div class="title">{{item.machine_name}}</div>
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
              <div class="item" v-for="spindle in item.rot_id" :key="spindle">
                {{spindle}}
              </div>
            </div>
          </el-card>
        </el-col>
      </el-row>
    </div>
  </div>
</template>
<script>

  export default {
    name: 'BoardDetail',
    props: {
      listData: {
        type: Array,
        default: []
      }
    },
    data() {
      return {
      }
    },
    created() {
      console.log(this.listData)
    },
    methods: {

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


