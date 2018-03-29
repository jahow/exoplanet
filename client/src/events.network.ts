import io from 'socket.io-client'
import init from './main'

const socket = io()

socket.on('connect', () => {
  console.log('connected as ' + socket.id)
})

export function handleViewMove (view: BABYLON.Camera) {
	console.log('network event: view move')
  socket.emit('message', {
    name: 'moveView',
    args: {
      minX: -100,
      maxX: 100,
      minY: -100,
      maxY: 100
    }
  }, (data: any) => {
    console.log(data)
  })
}