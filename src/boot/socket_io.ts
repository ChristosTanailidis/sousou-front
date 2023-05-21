import { boot } from 'quasar/wrappers'
import { io } from 'socket.io-client'

let socket = io(process.env.API_URL || '', {
  transports: [
    'websocket'
  ],

  auth: (cb) => {
    // eslint-disable-next-line n/no-callback-literal
    cb({ token: localStorage.getItem('sousou_token') })
  }
})

export const setSocketToken = (token: string) => {
  socket = io(process.env.API_URL || '', {
    transports: [
      'websocket'
    ],

    auth: (cb) => {
      // eslint-disable-next-line n/no-callback-literal
      cb({ token })
    }
  })
}

// socket.on('authorization', (data: string) => console.log(data))

export default boot(({ app }) => {
  app.config.globalProperties.$socket = socket
})

export { socket }
