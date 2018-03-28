import Graticule from './mesh.graticule'
import {generateTextMesh, TEXT_ANCHOR} from './mesh.text'

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

  generateTextMesh(scene, 'monospace', 'normal', '0,0',
      6, new BABYLON.Vector2(2, 2), TEXT_ANCHOR.BOTTOMLEFT, BABYLON.Color4.FromInts(255, 255, 255, 100))

  engine.runRenderLoop(function () {
    graticule.update()
    scene.render()
  })
}
