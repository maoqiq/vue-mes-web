import request from '@/utils/request'

export function searchRepairList(params) {
  return request({
    url: '/api/get_maintenance_list',
    method: 'post',
    data: params
  })
}
