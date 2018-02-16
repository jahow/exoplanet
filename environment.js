import Grid, { CHUNK_SIZE } from './grid'
import * as Materials from './materials'

// a grid cell is the unit of measure ie 1 meter
// as a planet is made of chunks, its perimeter must be a multiple of a chunk
// size

export const ENVIRONMENT_TYPE_DEFAULT = {
  atmosphereClass: Materials.MATERIAL_CARBON_DIOXIDE,
  groundClass: [
    Materials.MATERIAL_SAND,
    Materials.MATERIAL_SILICATE
  ],
  surfaceTemperature: [ 50, 230 ],
  perimeter: CHUNK_SIZE * 100
}

// the environment is made of a grid and entities
// it holds a grid of material that can be altered, and a list of entities

class Environment {
  constructor (environmentType) {
    this.entities = []
    this.type = environmentType
    this.grid = new Grid(this.cellGenerationCallback)
  }

  cellGenerationCallback (x, y) {
    let groundHeight = Math.random() * 8
    let groundClass = this.type.groundClass[Math.floor(Math.random() * this.type.groundClass.length)]
    return {
      class: y > groundHeight ? this.type.atmosphereClass : groundClass,
      amount: 0,
      pressure: 0,
      temperature: 0
    }
  }
}

export default Environment
