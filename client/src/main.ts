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

  generateTextMesh(scene, 'serif', 'normal', 'This is a test. &é"&é\'#~[{|{#}}]',
      10, new BABYLON.Vector2(5, 5), TEXT_ANCHOR.TOPLEFT)
  generateTextMesh(scene, 'serif', 'normal', '0,0',
      10, new BABYLON.Vector2(0, 0), TEXT_ANCHOR.CENTER)

  engine.runRenderLoop(function () {
    graticule.update()
    scene.render()
  })
}
