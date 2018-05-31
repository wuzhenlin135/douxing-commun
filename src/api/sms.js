import request from '@/utils/request'
import Qs from 'qs'

export function sendVerifyCode(modile) {
  const data = Qs.stringify({
    'modile': modile
  })
  return request({
    url: '/sms/verify-code',
    method: 'post',
    data: data
  })
}

