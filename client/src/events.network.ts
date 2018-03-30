import io from 'socket.io-client'
import init from './main'
import {CHUNK_SIZE} from '../../shared/src/globals'
import {getEnvironment} from './environment'
import {EnvironmentState} from './interfaces'

// socket init
const socket = io()

socket.on('connect', () => {
  console.log('connected as ' + socket.id)
})

// UPSTREAM EVENTS

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
  }, (data: EnvironmentState) => {
    console.log(data)
    handleEnvironmentUpdate(data)
  })
}

// DOWNSTREAM EVENTS

export function handleEnvironmentUpdate (state: EnvironmentState) {
  getEnvironment().updateState(state)
}