import Grid from './grid'
import {EnvironmentState} from './interfaces'

export default class Environment {
  grid: Grid

  constructor() {
    this.grid = new Grid()
  }

  updateState(state: EnvironmentState) {
    this.grid.updateChunks(state.chunks)
  }
}

let environment: Environment

export function getEnvironment(): Environment {
  if (!environment) {
    environment = new Environment()
  }
  return environment
}