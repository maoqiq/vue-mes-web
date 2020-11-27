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
          <template v-if="item.type=='yc'||item.type=='eff'">
            <el-carousel height="270px" :interval="2000" arrow="never" indicator-position="none">
              <el-carousel-item>
                <board-card :item="item"></board-card>
              </el-carousel-item>
              <el-carousel-item>
                <board-chart :item="item"></board-chart>
              </el-carousel-item>
            </el-carousel>
          </template>
          <template v-else>
            <board-card :item="item"></board-card>
          </template>
        </el-col>
      </el-row>
    </div>
  </div>
</template>
<script>
  import BoardCard from './BoardCard'
  import BoardChart from './BoardChart'
  export default {
    name: 'BoardDetail',
    components: { BoardCard,BoardChart},
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
</style>


