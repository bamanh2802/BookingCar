// test-socket.js
const { io } = require('socket.io-client')

const token =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2ODU2ZDBiOGJlOGQ5YjYxNjYzMDExODkiLCJlbWFpbCI6ImFkbWluQGJvb2tpbmdjYXIuY29tIiwicGhvbmUiOiIwOTg3NjU0MzIxIiwicm9sZUlkIjoiNjg0ZmUxYTAyNDNiZGY0YTU0YTE5ZGM0Iiwicm9sZU5hbWUiOiJBZG1pbiIsImlhdCI6MTc1MTM4NzI5NCwiZXhwIjoxNzUxMzkwODk0fQ.n_RNNyB-_s5unnvJ42n16hG3KxnhWw-lzO7fosIL17A' // ⚠️ thay bằng token thật

const socket = io('http://localhost:8080', {
  auth: {
    token, // ✅ middleware sẽ lấy từ socket.handshake.auth.token,
    transports: ['websocket']
  }
})

console.log('🔄 Đang kết nối tới server...')

socket.on('connect', () => {
  console.log('✅ [CLIENT] Đã kết nối với server')
  socket.emit('ping', 'Hello from test-socket.js')
})

socket.on('pong', (msg) => {
  console.log('📩 [CLIENT] Nhận pong từ server:', msg)
})

socket.on('notification', (data) => {
  console.log('🔔  Nhận thông báo:', data)
})

socket.on('disconnect', (reason) => {
  console.log('❌ [CLIENT] Đã ngắt kết nối. Lý do:', reason)
})

socket.on('connect_error', (err) => {
  console.error('🚫 [CLIENT] Lỗi kết nối:', err.message)
})

// 🧠 Giữ tiến trình Node chạy để không thoát ra
setInterval(() => {}, 1000)
