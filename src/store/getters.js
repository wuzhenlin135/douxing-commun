const getters = {
  sidebar: state => state.app.sidebar,
  device: state => state.app.device,
  token: state => state.user.token,
  avatar: state => state.user.avatar,
  name: state => state.user.name,
  qrcodeUrl: state => state.user.qrcodeUrl,
  status: state => state.user.status,
  statusLabel: state => state.user.statusLabel,
  roles: state => state.user.roles
}
export default getters
