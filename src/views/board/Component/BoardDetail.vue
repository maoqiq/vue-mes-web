<template> 
  <div class="app-container">
    <div class="board-layout">
      <el-row v-if="type=='yc'||type=='eff'" class="button-tab">
        <el-checkbox-group v-model="selectedTab" size="medium" @change="handleTabChange">
            <el-checkbox-button v-for="item in tabList" :label="item" :key="item">{{item}}</el-checkbox-button>
          </el-checkbox-group>
      </el-row>
      <el-row :gutter="20">
        <el-col class="no-data" v-if="!listData">
          <i class="el-icon-search"></i>
          暂无数据
        </el-col>
        <el-col v-else>
          <template v-if="type=='yc'||type=='eff'">
            <div v-if="selectedTabStr=='表格'">
              <el-col :span="6" v-for="(item,index) in listData"
                  :key="index">
                  <board-card :item="item"></board-card>
                </el-col>
            </div>
            <div v-if="selectedTabStr=='图表'">
              <el-col :span="6" v-for="(item,index) in listData"
                :key="index">
                <board-chart :item="item"></board-chart>
              </el-col>
            </div>
            <div v-if="selectedTabStr=='轮播'">
              <el-carousel :interval="2000" arrow="never" indicator-position="none">
                <el-carousel-item>
                  <el-col :span="6" v-for="(item,index) in listData"
                    :key="index">
                    <board-card :item="item"></board-card>
                  </el-col>
                </el-carousel-item>
                <el-carousel-item>
                  <el-col :span="6" v-for="(item,index) in listData"
                    :key="index">
                    <board-chart :item="item"></board-chart>
                  </el-col>
                </el-carousel-item>
              </el-carousel>
            </div>
          </template>
          <template v-else>
            <el-col :span="6" v-for="(item,index) in listData"
                  :key="index">
              <board-card :item="item"></board-card>
            </el-col>
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
        type: '',
        tabActiveName: 'banner',
        selectedTab: ['轮播'],
        selectedTabStr: '轮播',
        tabList: ['图表','表格','轮播']
      }
    },
    watch: {
      listData(){
        this.type = this.listData&&this.listData.length>0?this.listData[0].type:''
      }
    },
    created() {
      this.type = this.listData&&this.listData.length>0?this.listData[0].type:''
    },
    methods: {
      handleTabChange(arr){
        if(arr.length > 1){
          arr.shift()
        } else if(arr.length == 0){
          this.selectedTab = []
        }
        this.selectedTabStr = this.selectedTab&&this.selectedTab[0]
      },
    }
  }
</script>
<style rel="stylesheet/scss" lang="scss" scoped>
.button-tab{
    position: fixed;
  top: 56px;
  right: 166px;
  text-align: right;
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
</style>


