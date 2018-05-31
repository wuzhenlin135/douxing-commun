import request from '@/utils/request'

export function getToken() {
  return request({
    url: '/app/upload-token',
    method: 'get'
  })
}
