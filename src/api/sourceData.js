import request from '@/utils/request'

export function getSourceData(params) {
  return request({
    url: '/api/get_dataset',
    method: 'post',
    data: params
  })
}
