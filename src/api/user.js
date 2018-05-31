import request from '@/utils/request'
import Qs from 'qs'

export function submitCert(certFrom) {
  return request({
    url: '/app/submit-cert',
    method: 'post',
    data: Qs.stringify(certFrom)
  })
}

export function getCertInfo() {
  return request({
    url: '/app/cert-info',
    method: 'get'
  })
}

