<template>
  <board-detail :list-data="ycboardListMockDataArr"></board-detail>
</template>

<script>
  import request from '@/utils/request'
  import BoardDetail from './Component/BoardDetail'
  import ycboardListMockData from '@/mock/ycboardList.js'

  export default {
    name: 'ycboard',
    components: { BoardDetail },
    data() {
      return {
        ycboardListMockData,
        ycboardListMockDataArr: []
      }
    },
    created(){
      this.getData();
    },
    computed: {
    },
    methods:{
      getData(){
        for (let i = 0; i < 28; i++) {
          this.ycboardListMockDataArr.push(this.ycboardListMockData)
        }
        console.log(this.ycboardListMockDataArr)
      }
    }
  }
</script>

<style rel="stylesheet/scss" lang="scss" scoped>

</style>
