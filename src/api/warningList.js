import request from '@/utils/request'

export function getWarningList(params) {
  return request({
    url: '/api/get_warning',
    method: 'post',
    data: params
  })
}
