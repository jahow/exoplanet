import * as io from 'socket.io-client'
import init from './main'
import {CHUNK_SIZE} from '../../shared/src/globals'
import {getEnvironment} from './environment'
import {EnvironmentState} from './interfaces'
import {getViewExtent} from './utils.view'

// socket init
const socket = io()

socket.on('connect', () => {
  console.log('connected as ' + socket.id)
})

// UPSTREAM EVENTS

export function handleViewMove() {
  console.log('network event: view move', getViewExtent())
  socket.emit('message', {
    name: 'moveView',
    args: getViewExtent()
  })
}

// DOWNSTREAM EVENTS

export function handleEnvironmentUpdate(state: EnvironmentState) {
  getEnvironment().updateState(state)
}