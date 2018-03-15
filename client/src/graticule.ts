import {pushQuad} from './utils.geom'
import {getGenericMaterial} from './materials'

export default class Graticule {
  constructor (scene: BABYLON.Scene, camera: BABYLON.Camera) {
    const positions: number[] = []
    const colors: number[] = []
    const indices: number[] = []

    pushQuad(positions, colors, indices,
      -1, 0, -4.5, 3.5, BABYLON.Color4.FromInts(255, 255, 255, 100))
    pushQuad(positions, colors, indices,
      -4.5, 3.5, -1, 0, BABYLON.Color4.FromInts(255, 255, 255, 100))

    const graticule = new BABYLON.Mesh('graticule', scene)
    graticule.material = getGenericMaterial(scene)
    graticule.setVerticesData(BABYLON.VertexBuffer.PositionKind, positions, true);
    graticule.setVerticesData(BABYLON.VertexBuffer.ColorKind, colors, true);
    graticule.setIndices(indices, positions.length / 3, true)
  }

  update () {

  }
}