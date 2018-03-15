import io from 'socket.io-client'
import init from './main'

const socket = io()

socket.on('connect', () => {
  console.log('connected as ' + socket.id)

  socket.emit('message', {
    name: 'moveView',
    args: {
      minX: -10,
      maxX: 10,
      minY: -10,
      maxY: 10
    }
  }, (data) => {
    console.log(data)
  })
})

document.addEventListener('DOMContentLoaded', function () {
  if (BABYLON.Engine.isSupported()) {
    init()
  }
}, false)
