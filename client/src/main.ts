import Graticule from './graticule'
import {getTextMaterial} from './materials'
import {pushTexturedQuad} from './utils.geom'

export default function init () {
  // Get canvas
  const canvas = document.getElementById("render-target") as HTMLCanvasElement

  // Create babylon engine
  const engine = new BABYLON.Engine(canvas, true)

  // Create scene
  const scene = new BABYLON.Scene(engine)

  // Create the camera
  const camera = new BABYLON.ArcRotateCamera('main',
    -Math.PI / 2, Math.PI / 2, 100,
    new BABYLON.Vector3(16, 16, 0), scene)
  camera.attachControl(canvas)

  // scene.debugLayer.show()

  const graticule = new Graticule(scene, camera)

  const mesh = new BABYLON.Mesh('aaa', scene)
  mesh.material = getTextMaterial(scene, 'arial', 'normal')
  mesh.visibility = 0.9999
  const positions: number[] = []
  const colors: number[] = []
  const uvs: number[] = []
  const indices: number[] = []
  pushTexturedQuad(positions, colors, uvs, indices,
    0, 20, 0, 20,
    BABYLON.Color4.FromInts(255, 150, 120, 255),
    0, 1, 0, 1)

  mesh.setVerticesData(BABYLON.VertexBuffer.PositionKind, positions, true);
  mesh.setVerticesData(BABYLON.VertexBuffer.ColorKind, colors, true);
  mesh.setVerticesData(BABYLON.VertexBuffer.UVKind, uvs, true);
  mesh.setIndices(indices, positions.length / 3, true)

  engine.runRenderLoop(function () {
    graticule.update()
    scene.render()
  })
}
