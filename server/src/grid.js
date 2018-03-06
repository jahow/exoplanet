import { encodeMaterialInfo } from './materials'

// the grid handles materials arranged in squares, subdivided in chunks
// a chunk has a spatial, square boundary
export const CHUNK_SIZE = 32

class Grid {
  constructor (generateCellCallback) {
    // modified chunks are stored in a dict
    // keys are like so: 'chunkX|chunkY' where chunkX and chunkY are 0, 1, 2...
    this.savedChunks = {}
    this.cellCallback = generateCellCallback
  }

  getChunk (chunkX, chunkY) {
    const saved = this.savedChunks[`${chunkX}|${chunkY}`]
    return saved || this.generateChunk(chunkX, chunkY)
  }

  generateChunk (chunkX, chunkY) {
    const chunk = new Array(CHUNK_SIZE * CHUNK_SIZE)
    let x, y
    for (let i = 0; i < chunk.length; i++) {
      x = i % CHUNK_SIZE + chunkX * CHUNK_SIZE
      y = Math.floor(i / CHUNK_SIZE) + chunkY * CHUNK_SIZE
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
