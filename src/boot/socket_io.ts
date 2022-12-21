import { io } from 'socket.io-client'

const socket = io('http://localhost:3399', {
  transports: [
    'websocket'
  ],

  auth: (cb) => {
    // eslint-disable-next-line n/no-callback-literal
    cb({ token: localStorage.getItem('sousou_token') })
  }
})

// socket.on('authorization', (data: string) => console.log(data))

export { socket }
