import request from '@/utils/request'
export function getWarningConfig(params) {
  return request({
    url: '/api/get_warning_config',
    method: 'get',
    params: params
  })
}
export function settingWarningConfig(params) {
  return request({
    url: '/api/set_warning_config',
    method: 'post',
    data: params
  })
}
export function getDashboardConfig(params) {
  return request({
    url: '/api/get_dashboard_config',
    method: 'get',
    params: params
  })
}
export function settingDashboardConfig(params) {
  return request({
    url: '/api/set_dashboard_config',
    method: 'post',
    data: params
  })
}
