import { ExtendedMesh } from './utils.geom'
import { getViewExtent } from './utils.view'
import { getGenericMaterial } from './mesh.materials'
import { generateTextMesh } from './mesh.text'
import { getScene } from './globals'
import { CHUNK_SIZE } from '../../shared/src/globals'
import { getDebugMode } from './utils.misc'
import { AnchorType, AnchorTypes } from './enums'

export default class Graticule {
  positions: number[]
  colors: number[]
  indices: number[]
  minX: number
  maxX: number
  minY: number
  maxY: number
  rootMesh: BABYLON.Mesh
  mesh: ExtendedMesh
  textMeshes: ExtendedMesh[]

  constructor() {
    this.rootMesh = new BABYLON.Mesh('graticule root', getScene())

    this.mesh = new ExtendedMesh('graticule', getScene())
    this.mesh.material = getGenericMaterial()
    this.mesh.visibility = 0.9999 // triggers alpha blending
    this.mesh.renderingGroupId = 3
    this.mesh.isPickable = false
    this.mesh.parent = this.rootMesh

    this.textMeshes = []

    const originMesh = generateTextMesh(
      'monospace',
      'normal',
      'origin',
      6,
      new BABYLON.Vector2(16, 16),
      AnchorTypes.CENTER
    )
    originMesh.parent = this.rootMesh
  }

  update() {
    if (!getDebugMode()) {
      this.rootMesh.setEnabled(false)
      return
    }

    this.rootMesh.setEnabled(true)

    // compute view extent
    const extent = getViewExtent()

    if (
      extent.minX !== this.minX ||
      this.minY !== extent.minY ||
      extent.maxX !== this.maxX ||
      this.maxY !== extent.maxY
    ) {
      this.minX = extent.minX
      this.minY = extent.minY
      this.maxX = extent.maxX
      this.maxY = extent.maxY

      this.rebuildMesh()
    }
  }

  rebuildMesh() {
    // clear existing text meshes
    this.textMeshes.forEach(m => m.dispose(false, false))
    this.textMeshes.length = 0

    // generate cross
    this.positions = []
    this.colors = []
    this.indices = []

    let text

    this.mesh.clearVertices()

    for (let x = this.minX; x <= this.maxX + CHUNK_SIZE; x += CHUNK_SIZE) {
      for (let y = this.minY; y <= this.maxY + CHUNK_SIZE; y += CHUNK_SIZE) {
        this.mesh
          .pushQuad({
            minX: x - 1,
            maxX: x,
            minY: y - 4.5,
            maxY: y + 3.5,
            color: BABYLON.Color4.FromInts(255, 255, 255, 100)
          })
          .pushQuad({
            minX: x - 4.5,
            maxX: x + 3.5,
            minY: y - 1,
            maxY: y,
            color: BABYLON.Color4.FromInts(255, 255, 255, 100)
          })

        // text mesh
        // TODO: optimize this to reduce the performance hit
        text = generateTextMesh(
          'monospace',
          'normal',
          `${x},${y}`,
          4,
          new BABYLON.Vector2(x + 2, y + 2),
          AnchorTypes.BOTTOMLEFT,
          BABYLON.Color4.FromInts(255, 255, 255, 100)
        )
        text.parent = this.rootMesh

        this.textMeshes.push(text)
      }
    }

    this.mesh.commit()
  }
}
