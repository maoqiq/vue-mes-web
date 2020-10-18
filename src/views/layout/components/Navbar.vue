<template>
  <el-menu class="navbar" mode="horizontal">
    <hamburger class="hamburger-container" :toggleClick="toggleSideBar" :isActive="sidebar.opened"></hamburger>
    <breadcrumb></breadcrumb>
    <span v-if="showBoardDate" class="board-date">当天（2020.09.28 00:00 - 2020.09.28 24:00）</span>
  </el-menu>
</template>

<script>
import { mapGetters } from 'vuex'
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
      showBoardDate: true
    }
  },
  watch: {
    $route() {
      this.handleBoardDate()
    }
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
      let parentMatched = this.$route.matched.filter(item => item.name)[0]
      console.log(parentMatched)
      if(parentMatched.meta.title === "看板"){
        this.showBoardDate = true
      } else {
        this.showBoardDate = false
      }
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

