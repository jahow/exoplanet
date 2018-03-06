import Environment, { ENVIRONMENT_TYPE_DEFAULT } from './environment'
import { getTime, capExtent } from './utility'

// in meters
const MAX_EXTENT_SIZE = 1000

// the simulation object handles sending environment chunks to the clients,
// dispatching client actions, updating the environment by cycles

class Simulation {
  constructor () {
    // a value in ms; will be incremented by cycles
    this.time = 0
    this.lastUpdate = getTime()

    // the simulation environment (grid, entities…)
    this.environment = new Environment(ENVIRONMENT_TYPE_DEFAULT)

    // viewers must be notified whenever there's a change in the part of the
    // environment they are watching
    this.viewers = {}
  }

  getEnvironment () {
    return this.environment
  }

  start () {
  }

  update () {
    const t = getTime()
    this.time = t - this.lastUpdate
    this.lastUpdate = t

    // do stuff here
  }

  registerViewer (id) {
    if (this.viewers[id]) {
      console.error('A viewer with the id ' + id +
        ' has already been registered: ', this.viewers[id])
      return
    }
    this.viewers[id] = {
      viewExtent: null
    }
  }

  getViewer (id) {
    if (!this.viewers[id]) {
      throw new Error('No viewer found with the id ' + id)
    }
    return this.viewers[id]
  }

  // once set here, an extent is always assumed to be valid
  setViewExtent (viewerId, extent) {
    const v = this.getViewer(viewerId)
    v.viewExtent = capExtent(extent, MAX_EXTENT_SIZE)
    return v.viewExtent
  }
}

// unique instance
const sim = new Simulation()

export function startSimulation () {
  console.log('Simulation started')
  sim.start()
}

export function registerViewer (id) {
  sim.registerViewer(id)
}

// might return something
export function handleMessage (senderId, message, args) {
  console.log('handling message ' + message + ' from ' + senderId)

  switch (message) {
    case 'moveView':
      const extent = sim.setViewExtent(senderId, args)
      // console.log(extent)
      return sim.getEnvironment().getGridChunks(
        extent.minX, extent.maxX, extent.minY, extent.maxY,
        true)
    case 'alterGridCell':
      // return
  }
}
