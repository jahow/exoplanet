import Graticule from './mesh.graticule'
import {generateTextMesh, TEXT_ANCHOR} from './mesh.text'
import {initGlobals, getEngine, getScene, getCanvas} from './globals'

export default function init () {
  initGlobals()

  // Create the camera
  const camera = new BABYLON.ArcRotateCamera('main',
    -Math.PI / 2, Math.PI / 2, 100,
    new BABYLON.Vector3(16, 16, 0), getScene())
  camera.attachControl(getCanvas())

  // scene.debugLayer.show()

  const graticule = new Graticule(camera)

  generateTextMesh('monospace', 'normal', 'origin',
      6, new BABYLON.Vector2(16, 16), TEXT_ANCHOR.CENTER)

  getEngine().runRenderLoop(function () {
    graticule.update()
    getScene().render()
  })
}
