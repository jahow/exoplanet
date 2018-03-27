import {pushColoredQuad} from './utils.geom'
import {getGenericMaterial} from './materials'

// todo: get this from common code
const CHUNK_SIZE = 32

export default class Graticule {
  positions: number[]
  colors: number[]
  indices: number[]
  minX: number
  maxX: number
  minY: number
  maxY: number
  camera: BABYLON.ArcRotateCamera
  mesh: BABYLON.Mesh

  constructor (scene: BABYLON.Scene, camera: BABYLON.ArcRotateCamera) {
    this.camera = camera

    this.mesh = new BABYLON.Mesh('graticule', scene)
    this.mesh.material = getGenericMaterial(scene)
    this.mesh.visibility = 0.9999  // triggers alpha blending

    // temp: generate one mesh per digit
    // TODO: find a better way to handle text (glyph atlas / SDF)

  }

  update () {
    // compute view extent
    // TODO: ACTuALLY COMPUTE SOMETHING IDIOT
    let x = this.camera.target.x
    let y = this.camera.target.y
    let width = this.camera.radius
    let height = this.camera.radius

    let minX = x - width / 2
    minX = Math.floor(minX / CHUNK_SIZE) * CHUNK_SIZE
    let minY = y - height / 2
    minY = Math.floor(minY / CHUNK_SIZE) * CHUNK_SIZE
    let maxX = x + width / 2
    maxX = Math.ceil(maxX / CHUNK_SIZE) * CHUNK_SIZE
    let maxY = y + height / 2
    maxY = Math.ceil(maxY / CHUNK_SIZE) * CHUNK_SIZE

    if (minX !== this.minX || this.minY !== minY ||
        maxX !== this.maxX || this.maxY !== maxY) {
      this.minX = minX
      this.minY = minY
      this.maxX = maxX
      this.maxY = maxY

      this.rebuildMesh()
    }
  }

  rebuildMesh () {
    this.positions = []
    this.colors = []
    this.indices = []

    for (let x = this.minX; x <= this.maxX; x += CHUNK_SIZE) {
      for (let y = this.minY; y <= this.maxY; y += CHUNK_SIZE) {
        pushColoredQuad(this.positions, this.colors, this.indices,
          x - 1, x, y - 4.5, y + 3.5,
          BABYLON.Color4.FromInts(255, 255, 255, 100))
        pushColoredQuad(this.positions, this.colors, this.indices,
          x - 4.5, x + 3.5, y - 1, y,
          BABYLON.Color4.FromInts(255, 255, 255, 100))
      } 
    }

    this.mesh.setVerticesData(BABYLON.VertexBuffer.PositionKind, this.positions, true);
    this.mesh.setVerticesData(BABYLON.VertexBuffer.ColorKind, this.colors, true);
    this.mesh.setIndices(this.indices, this.positions.length / 3, true)
  }
}