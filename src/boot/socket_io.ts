import { io } from 'socket.io-client'

export const socket = io('http://localhost:9999', {
  transports: [
    'websocket',
    'polling'
  ],
  auth: {
    token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjE5Mzg5ODEzLTdiZDUtNDlkOC1hMGZlLWE4NzA2ZjM4ZTRjMSIsImVtYWlsIjoidGVzdDNAdGVzdC50ZXN0IiwidXNlcm5hbWUiOiJ0ZXN0MyIsImRpc3BsYXlOYW1lIjoidGVzdDMiLCJpY29uIjoiIiwicHJlZmVyZW5jZXMiOnt9LCJjb2RlIjoiNDQwMCIsImlhdCI6MTY3MTY0NzU2MSwiZXhwIjoxNjcxNjUxMTYxfQ.nCZoRlrrWJKoVjyuMuxxd9Bi0x0qBhXGFmRy9-oaRj0'
  },
  transportOptions: {
    websocket: {
      Headers: {
        authorization: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjE5Mzg5ODEzLTdiZDUtNDlkOC1hMGZlLWE4NzA2ZjM4ZTRjMSIsImVtYWlsIjoidGVzdDNAdGVzdC50ZXN0IiwidXNlcm5hbWUiOiJ0ZXN0MyIsImRpc3BsYXlOYW1lIjoidGVzdDMiLCJpY29uIjoiIiwicHJlZmVyZW5jZXMiOnt9LCJjb2RlIjoiNDQwMCIsImlhdCI6MTY3MTY0NzU2MSwiZXhwIjoxNjcxNjUxMTYxfQ.nCZoRlrrWJKoVjyuMuxxd9Bi0x0qBhXGFmRy9-oaRj0'
      }
    }
  }
})
