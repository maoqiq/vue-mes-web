import request from '@/utils/request'

export function getSpindleList(params) {
  return request({
    url: '/api/get_spindle_list',
    method: 'post',
    data: params
  })
}
