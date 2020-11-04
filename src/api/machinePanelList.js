import request from '@/utils/request'

export function machineDropDown() {
  return request({
    url: '/api/get_spinning_machine_list',
    method: 'get'
  })
}

export function getMachineList(params) {
  return request({
    url: '/api/get_production_data',
    method: 'post',
    data: params
  })
}
