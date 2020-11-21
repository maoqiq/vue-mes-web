import request from '@/utils/request'

export function settingWarningConfig(params) {
  return request({
    url: '/api/set_warning_config',
    method: 'post',
    data: params
  })
}
