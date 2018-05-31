import request from '@/utils/request'
import axios from 'axios'
export function getList(params) {
  return request({
    url: 'app/order-list',
    method: 'get',
    params
  })
}

export function getFitlers() {
  return request({
    url: 'app/order-fitlers',
    method: 'get'
  })
}

export function getPageData(params) {
  return new Promise((resolve, reject) => {
    axios.all([getList(params), getFitlers()]).then(axios.spread((listResp, filterResp) => {
      resolve(listResp, filterResp)
    }))
  })
}
