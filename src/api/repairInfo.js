import request from '@/utils/request'

export function getRepairTypeList() {
  return request({
    url: '/api/get_maintenance_type_list',
    method: 'get'
  })
}

export function searchRepairList(params) {
  return request({
    url: '/api/get_maintenance_list',
    method: 'post',
    data: params
  })
}

export function createRepair(params) {
  return request({
    url: '/api/create_maintenance_order',
    method: 'post',
    data: params
  })
}
