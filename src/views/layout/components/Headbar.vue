<template>
  <el-menu class="headbar" mode="horizontal">
    <div class="logobar">
      <img :src="img_logo" class="logo-icon">
      <span>立颍纺纱MES</span>
    </div>
    <el-dropdown class="avatar-container" trigger="click">
      <div class="avatar-wrapper">
        <!-- <img class="user-avatar" :src="avatar"> -->
        <i class="el-icon-s-custom"></i>
        <span>{{name}}</span>
        <i class="el-icon-caret-bottom"></i>
      </div>
      <el-dropdown-menu class="user-dropdown" slot="dropdown">
        <el-dropdown-item divided>
          <span @click="logout" style="display:block;">退出</span>
        </el-dropdown-item>
      </el-dropdown-menu>
    </el-dropdown>
    <div class="warning">
      <i class="el-icon-message-solid"></i>
    </div>
  </el-menu>
</template>

<script>
import { mapGetters } from 'vuex'
import Breadcrumb from '@/components/Breadcrumb'
import Hamburger from '@/components/Hamburger'
import img_logo from '@/assets/images/logo.png';

export default {
  data() {
    return {
      img_logo
    }
  },
  components: {
    Breadcrumb,
    Hamburger
  },
  computed: {
    ...mapGetters([
      'sidebar',
      'avatar',
      'name'
    ])
  },
  methods: {
    logout() {
      this.$store.dispatch('LogOut').then(() => {
        location.reload() // 为了重新实例化vue-router对象 避免bug
      })
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
.headbar {
  height: 50px;
  line-height: 50px;
  border-radius: 0px !important;
  .logobar {
    margin-left: 20px;
    display: flex;
    span{
      padding: 0 12px;
      font-weight: bold;
      color: #0079FE;
    }
  }
  .avatar-container {
    height: 50px;
    position: absolute;
    right: 80px;
    top: 0;
    .avatar-wrapper {
      cursor: pointer;
      margin-top: 5px;
      position: relative;
      display: flex;
      .user-avatar {
        width: 40px;
        height: 40px;
        border-radius: 10px;
      }
      span {
        display: inline-block;
        line-height: 40px;
      }
      .el-icon-s-custom{
        font-size: 12px;
        font-size: 32px;
        line-height: 42px;
        margin-right: 4px;
      }
      .el-icon-caret-bottom {
        position: absolute;
        right: -20px;
        top: 15px;
        font-size: 12px;
      }
    }
  }
  .warning {
    height: 50px;
    position: absolute;
    right: 0;
    top: 0;
    width: 50px;
  }
}
.logo-icon {
  width: 50px;
  height: 50px;
}
</style>

