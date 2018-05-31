import { login, logout, getProfile } from '@/api/login'
import { getToken, setToken, removeToken } from '@/utils/auth'

const user = {
  state: {
    token: getToken(),
    name: '',
    nickName: '',
    status: 0,
    statusLabel: '',
    qrcodeUrl: '',
    avatar: '',
    roles: []
  },

  mutations: {
    SET_TOKEN: (state, token) => {
      state.token = token
    },
    SET_NICK_NAME: (state, nickName) => {
      state.nickName = nickName
    },
    SET_NAME: (state, name) => {
      state.name = name
    },
    SET_AVATAR: (state, avatar) => {
      state.avatar = avatar
    },
    SET_QRCODEURL: (state, qrcodeUrl) => {
      state.qrcodeUrl = qrcodeUrl
    },
    SET_STATUS: (state, status) => {
      state.status = status
    },
    SET_STATUS_LABEL: (state, statusLabel) => {
      state.statusLabel = statusLabel
    },
    SET_ROLES: (state, roles) => {
      state.roles = roles
    }
  },

  actions: {
    // 登录
    Login({ commit }, userInfo) {
      const username = userInfo.username.trim()
      return new Promise((resolve, reject) => {
        login(username, userInfo.password).then(response => {
          const obj = response.obj
          setToken(obj.token)
          commit('SET_TOKEN', obj.token)
          resolve()
        }).catch(error => {
          reject(error)
        })
      })
    },

    // 获取用户信息
    GetProfile({ commit, state }) {
      return new Promise((resolve, reject) => {
        getProfile(state.token).then(response => {
          const data = response.obj
          if (data.roles && data.roles.length > 0) { // 验证返回的roles是否是一个非空数组
            commit('SET_ROLES', data.roles)
          } else {
            reject('getInfo: roles must be a non-null array !')
          }
          commit('SET_NAME', data.userName)
          commit('SET_NICK_NAME', data.nickName)
          commit('SET_AVATAR', data.avatar)
          commit('SET_QRCODEURL', data.qrcodeUrl)
          commit('SET_STATUS', data.status)
          commit('SET_STATUS_LABEL', data.statusLabel)
          resolve(response)
        }).catch(error => {
          reject(error)
        })
      })
    },

    // 登出
    LogOut({ commit, state }) {
      return new Promise((resolve, reject) => {
        logout(state.token).then(() => {
          commit('SET_TOKEN', '')
          commit('SET_NAME', '')
          commit('SET_NICK_NAME', '')
          commit('SET_QRCODEURL', '')
          commit('SET_STATUS', 0)
          commit('SET_STATUS_LABEL', '')
          commit('SET_ROLES', [])
          removeToken()
          resolve()
        }).catch(error => {
          reject(error)
        })
      })
    },

    // 前端 登出
    FedLogOut({ commit }) {
      return new Promise(resolve => {
        commit('SET_TOKEN', '')
        removeToken()
        resolve()
      })
    }
  }
}

export default user
