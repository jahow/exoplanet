import Graticule from './mesh.graticule'
import {generateTextMesh, TEXT_ANCHOR} from './mesh.text'
import {initGlobals, getEngine, getScene, getCanvas} from './globals'
import {getEnvironment} from './environment'
import {EnvironmentState} from './interfaces'
import * as Materials from '../../shared/src/materials'
import {adjustView, adjustViewRelative, updateView} from './utils.view'
import {initInput, updateInputState} from './utils.input'

export default function init () {
  initGlobals()
  initInput()

  // Create the camera
  const camera = new BABYLON.ArcRotateCamera('main',
    -Math.PI / 2, Math.PI / 2, 10,
    new BABYLON.Vector3(16, 16, 0), getScene())

  camera.mode = BABYLON.Camera.ORTHOGRAPHIC_CAMERA
  adjustView(camera, BABYLON.Vector2.Zero(), 1)
  window.onresize = () => {
    getEngine().resize()
    adjustViewRelative(camera, BABYLON.Vector2.Zero(), 0)
  }

  // getScene().debugLayer.show()

  const graticule = new Graticule(camera)

  generateTextMesh('monospace', 'normal', 'origin',
      6, new BABYLON.Vector2(16, 16), TEXT_ANCHOR.CENTER)

  const viewDiff = BABYLON.Vector2.Zero()

  getEngine().runRenderLoop(function () {
    graticule.update()
    updateInputState()
    updateView(camera)

    getScene().render()
  })
}
