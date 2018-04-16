import {pushColoredQuad} from './utils.geom'
import {getViewExtent} from './utils.view'
import {getGenericMaterial} from './mesh.materials'
import {generateTextMesh, TEXT_ANCHOR} from './mesh.text'
import {getScene} from './globals'
import {CHUNK_SIZE} from '../../shared/src/globals'
import {getDebugMode} from './utils.misc'

export default class Graticule {
  positions: number[]
  colors: number[]
  indices: number[]
  minX: number
  maxX: number
  minY: number
  maxY: number
  rootMesh: BABYLON.Mesh
  mesh: BABYLON.Mesh
  textMeshes: BABYLON.Mesh[]

  constructor () {
    this.rootMesh = new BABYLON.Mesh('graticule root', getScene())

    this.mesh = new BABYLON.Mesh('graticule', getScene())
    this.mesh.material = getGenericMaterial()
    this.mesh.visibility = 0.9999  // triggers alpha blending
    this.mesh.renderingGroupId = 3
    this.mesh.isPickable = false
    this.mesh.parent = this.rootMesh

    this.textMeshes = []
  }

  update () {
    if (!getDebugMode()) {
      this.rootMesh.setEnabled(false)
      return
    }

    this.rootMesh.setEnabled(true)

    // compute view extent
    const extent = getViewExtent()

    if (extent.minX !== this.minX || this.minY !== extent.minY ||
        extent.maxX !== this.maxX || this.maxY !== extent.maxY) {
      this.minX = extent.minX
      this.minY = extent.minY
      this.maxX = extent.maxX
      this.maxY = extent.maxY

      this.rebuildMesh()
    }
  }

  rebuildMesh () {
    // clear existing text meshes
    this.textMeshes.forEach(m => m.dispose(false, false))
    this.textMeshes.length = 0

    // generate cross
    this.positions = []
    this.colors = []
    this.indices = []

    let text

    for (let x = this.minX; x <= this.maxX + CHUNK_SIZE; x += CHUNK_SIZE) {
      for (let y = this.minY; y <= this.maxY + CHUNK_SIZE; y += CHUNK_SIZE) {
        pushColoredQuad(this.positions, this.colors, this.indices,
          x - 1, x, y - 4.5, y + 3.5,
          BABYLON.Color4.FromInts(255, 255, 255, 100))
        pushColoredQuad(this.positions, this.colors, this.indices,
          x - 4.5, x + 3.5, y - 1, y,
          BABYLON.Color4.FromInts(255, 255, 255, 100))

        // text mesh
        // TODO: optimize this to reduce the performance hit
        text = generateTextMesh('monospace', 'normal', `${x},${y}`,
          4, new BABYLON.Vector2(x + 2, y + 2), TEXT_ANCHOR.BOTTOMLEFT,
          BABYLON.Color4.FromInts(255, 255, 255, 100))
        text.parent = this.rootMesh

        this.textMeshes.push(text)
      } 
    }

    this.mesh.setVerticesData(BABYLON.VertexBuffer.PositionKind, this.positions, true);
    this.mesh.setVerticesData(BABYLON.VertexBuffer.ColorKind, this.colors, true);
    this.mesh.setIndices(this.indices, this.positions.length / 3, true)
  }
}