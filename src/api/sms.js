import request from '@/utils/request'
import Qs from 'qs'

export function sendVerifyCode(modile, type = 0) {
  const data = Qs.stringify({
    'modile': modile,
    'type': type
  })
  return request({
    url: '/sms/verify-code',
    method: 'post',
    data: data
  })
}

