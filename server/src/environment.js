import Grid from './grid'
import {CHUNK_SIZE} from '../../shared/src/globals'
import * as Materials from '../../shared/src/materials'
import {getChunksInExtent, getChunksBySubtractingExtents} from '../../shared/src/view-extent'
import NoiseGenerator from './noise.js'

NoiseGenerator.seed(Math.random())

// a grid cell is the unit of measure ie 1 meter
// as a planet is made of chunks, its perimeter must be a multiple of a chunk
// size

export const ENVIRONMENT_TYPE_DEFAULT = {
  atmosphereClass: Materials.MATERIAL_CARBON_DIOXIDE,
  groundClass: [
    Materials.MATERIAL_SAND,
    Materials.MATERIAL_SILICATE,
    Materials.MATERIAL_LIMESTONE,
    Materials.MATERIAL_VOLCANIC_ROCK
  ],
  seaClass: Materials.MATERIAL_WATER,
  surfaceTemperature: [ 50, 230 ],
  perimeter: CHUNK_SIZE * 100
}

// the environment is made of a grid and entities
// it holds a grid of material that can be altered, and a list of entities

class Environment {
  constructor (environmentType) {
    this.entities = []
    this.type = environmentType
    this.grid = new Grid(this.cellGenerationCallback.bind(this))
  }

  cellGenerationCallback (x, y) {
    let groundHeight = 120 * NoiseGenerator.perlin(0.002 * x + 100.1567, {
      octaveCount: 5,
      persistence: 0.6
    })

    if (y > groundHeight) {
      return {
        class: y >= 0 ? this.type.atmosphereClass : this.type.seaClass,
        amount: 0,
        pressure: y >= 0 ? Math.max(0, 255 - y) : Math.min(255, -y),
        temperature: 0
      }
    } else {
      let classes = this.type.groundClass
      let groundClass
      let maxLevel = -10
      const sliceHeight = 20
      let sliceNoise = sliceHeight * 3 * (0.5 + NoiseGenerator.perlin(0.0002 * x + 500.796 + 0.008 * y))
      let slice = Math.floor((groundHeight - y + sliceNoise) / sliceHeight)
      for (let i = 0; i < classes.length; i++) {
        let level = NoiseGenerator.perlin(0.005 * x + 0.9431 + 10000 * slice + i * 45.1873)
        if (level > maxLevel) {
          groundClass = classes[i]
          maxLevel = level
        }
      }

      return {
        class: groundClass,
        amount: 0,
        pressure: 0,
        temperature: 0
      }
    }
  }

  getFullState (extent) {
    return {
      chunks: this.grid.getChunks(
        getChunksInExtent(extent),
        true
      )
    }
  }

  getPartialState (newExtent, oldExtent) {
    return {
      chunks: this.grid.getChunks(
        getChunksBySubtractingExtents(oldExtent, newExtent),
        true
      )
    }
  }
}

export default Environment
