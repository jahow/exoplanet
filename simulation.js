import Environment, { ENVIRONMENT_TYPE_DEFAULT } from './environment'
import { getTime } from './utility'

// the simulation object handles sending environment chunks to the clients,
// dispatching client actions, updating the environment by cycles

class Simulation {
  constructor () {
    // a value in ms; will be incremented by cycles
    this.time = 0
    this.lastUpdate = getTime()

    // the simulation environment (grid, entities…)
    this.environment = new Environment(ENVIRONMENT_TYPE_DEFAULT)
  }

  start () {
  }

  update () {
    const t = getTime()
    this.time = t - this.lastUpdate
    this.lastUpdate = t

    // do stuff here
  }
}

const sim = new Simulation()

export function startSimulation () {
  sim.start()
}

export function handleMessage (message) {

}
