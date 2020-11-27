import Cookies from 'js-cookie'

const dashboard = {
  state: {
    dashboardTime: {
      path: '/YCboard',
      displayTime: ''
    }
  },
  mutations: {
    SET_DISPLAY_TIME: (state,type) => {
      console.log(type)
      state.dashboardTime = type
    }
  },
  actions: {
    SetDispalyTime: ({ commit },displayTime) => {
      commit('SET_DISPLAY_TIME',displayTime)
    }
  }
}

export default dashboard
