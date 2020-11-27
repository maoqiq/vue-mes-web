<template>
  <el-menu class="navbar" mode="horizontal">
    <hamburger class="hamburger-container" :toggleClick="toggleSideBar" :isActive="sidebar.opened"></hamburger>
    <breadcrumb></breadcrumb>
    <span v-if="showBoardDate" class="board-date">
      {{displayTime}}
    </span>
  </el-menu>
</template>

<script>
import { mapGetters } from 'vuex'
import store from '../../../store'
import Breadcrumb from '@/components/Breadcrumb'
import Hamburger from '@/components/Hamburger'

export default {
  components: {
    Breadcrumb,
    Hamburger
  },
  computed: {
    ...mapGetters([
      'sidebar',
      'avatar'
    ])
  },
  data() {
    return {
      showBoardDate: true,
      dashboardTime: null,
      displayTime: ''
    }
  },
  watch: {
    $route() {
      this.handleBoardDate()
    }
  },
  created() {
    console.log(this.$route)
    this.handleBoardDate()
  },
  mounted() {

  },
  methods: {
    toggleSideBar() {
      this.$store.dispatch('ToggleSideBar')
    },
    logout() {
      this.$store.dispatch('LogOut').then(() => {
        location.reload() // 为了重新实例化vue-router对象 避免bug
      })
    },
    handleBoardDate() {
      let self = this
      setTimeout(()=>{
        console.log(store)
        self.dashboardTime = store.getters.dashboardTime
        let parentMatched = self.$route&&self.$route.matched.filter(item => item.name)[0]
        let path = self.$route&&self.$route.fullPath
        console.log(self.dashboardTime)
        if(parentMatched.meta.title === "看板"){
          self.showBoardDate = true
          if(path==self.dashboardTime.path){
            self.displayTime = self.dashboardTime.displayTime
          }
        } else {
          self.showBoardDate = false
        }
      },1000)
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
.navbar {
  height: 50px;
  line-height: 50px;
  border-radius: 0px !important;
  display: flex;
  .hamburger-container {
    line-height: 58px;
    height: 50px;
    float: left;
    padding: 0 10px;
  }
  .board-date {
    padding-left: 12px;
    color: #101010;
    font-size: 14px;
  }
}
</style>

