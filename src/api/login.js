import request from '@/utils/request'
import Qs from 'qs'
export function login(username, password) {
  const data = Qs.stringify({
    'username': username,
    'password': password
  })
  return request({
    url: '/web/login',
    method: 'post',
    data: data
  })
}

export function getProfile() {
  return request({
    url: '/app/profile',
    method: 'get'
  })
}

export function signup(signupForm) {
  return request({
    url: '/web/signup',
    method: 'post',
    data: Qs.stringify(signupForm)
  })
}

export function resetToken(username, code, sign) {
  const data = Qs.stringify({
    'username': username,
    'code': code,
    'sign': sign
  })
  return request({
    url: '/web/reset-token',
    method: 'post',
    data: data
  })
}

export function resetPassword(passwordResetToken, password) {
  const data = Qs.stringify({
    'passwordResetToken': passwordResetToken,
    'password': password
  })
  return request({
    url: '/web/reset-password',
    method: 'post',
    data: data
  })
}

export function logout() {
  return request({
    url: '/app/logout',
    method: 'post'
  })
}
