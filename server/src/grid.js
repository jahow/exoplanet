import {encodeMaterialInfo} from '../../shared/src/materials'
import {CHUNK_SIZE} from '../../shared/src/globals'

class Grid {
  constructor (generateCellCallback) {
    // modified chunks are stored in a dict
    // keys are like so: 'baseX|baseY' where baseX and baseY are 0, 32, 64...
    this.savedChunks = {}
    this.cellCallback = generateCellCallback
  }

  getChunk (baseX, baseY) {
    const saved = this.savedChunks[`${baseX} ${baseY}`]
    return saved || this.generateChunk(baseX, baseY)
  }

  generateChunk (baseX, baseY) {
    const chunk = new Array(CHUNK_SIZE * CHUNK_SIZE)
    let x, y
    for (let i = 0; i < chunk.length; i++) {
      x = i % CHUNK_SIZE + baseX
      y = Math.floor(i / CHUNK_SIZE) + baseY
      chunk[i] = this.cellCallback(x, y)
    }
    return chunk
  }

  getChunks (coords, encoded) {
    return coords.reduce((prev, coord) => {
      const chunk = this.getChunk(coord[0], coord[1])
      prev[`${coord[0]} ${coord[1]}`] = encoded
        ? chunk.map(encodeMaterialInfo) : chunk
      return prev
    }, {})
  }
}

export default Grid
