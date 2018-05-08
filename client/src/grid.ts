import {ChunkCollection} from './interfaces'
import {GridChunk} from './mesh.gridchunk'

export default class Grid {
  chunks: {
    [key: string]: GridChunk    // key is "<x> <y>"
  }

  constructor() {
    this.chunks = {}
  }

  /**
   * Copy the encoded chunks in the collection into the grid
   */
  updateChunks(encodedChunks: ChunkCollection) {
    Object.keys(encodedChunks).forEach(key => {
      this.getChunkByKey(key).updateChunk(encodedChunks[key])
    })
  }

  /**
   * Return a grid chunk, create it if absent from a coord key (<x> <y>)
   */
  getChunkByKey(key: string): GridChunk {
    if (!this.chunks[key]) {
      const coords = key.split(' ').map(c => parseInt(c))
      this.chunks[key] = new GridChunk(coords[0], coords[1])
    }
    return this.chunks[key]
  }

  /**
   * Remove chunk with the given key (ie dispose mesh)
   */
  removeChunkByKey(key: string) {
    if (this.chunks[key]) {
      this.chunks[key].dispose()
      this.chunks[key] = undefined
    }
  }
}