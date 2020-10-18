<template> 
  <div class="app-container">
    <div class="board-layout">
      <el-row :gutter="20">
        <el-col :span="6" v-for="(item,index) in listData"
            :key="index">
          <el-card class="box-card" :body-style="{ padding: '14px 0 0' }">
            <div slot="header">
              <div style="margin:-18px -20px;" class="clearfix">
                <div class="title">{{item.machineNum}}号气流纺机</div>
                <div class="number">
                  <span class="failed" :style="{color:item.diyStyle}">{{item.shadingFailedSum}}</span>
                  <span>/ 860</span>
                </div>
                <i class="el-icon-s-management" :style="{color:item.diyStyle}"></i>
              </div>
            </div>
            <div class="text-center">
              <div class="item" v-for="shading in item.shadingFailedArr" :key="shading">
                {{shading}}
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
        // listData: []
      }
    },
    created() {
      console.log(this.listData)
      // if (this.listData) {
      //   this.listData = this.listData;
      // }
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
</style>


