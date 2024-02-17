import { boot } from 'quasar/wrappers'
import { io } from 'socket.io-client'

const socket = io(process.env.API_URL || '', {
  transports: [
    'websocket'
  ],

  auth: (cb) => {
    // eslint-disable-next-line n/no-callback-literal
    cb({ token: localStorage.getItem('sousou_token') })
  },

  autoConnect: false
})

export const setSocketToken = (token: string) => {
  socket.disconnect()
  // eslint-disable-next-line n/no-callback-literal
  socket.auth = (cb) => { cb({ token }) }
  socket.connect()
}

export default boot(({ app }) => {
  app.config.globalProperties.$socket = socket
})

export { socket }
