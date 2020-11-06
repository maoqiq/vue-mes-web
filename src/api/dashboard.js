import request from '@/utils/request'

export function getDashboardList(params) {
  return request({
    url: '/api/get_dashboard_data',
    method: 'post',
    data: params
  })
}
