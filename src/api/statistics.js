import request from '@/utils/request'

export function getStatistics() {
  return request({
    url: '/app/statistics',
    method: 'get'
  })
}

