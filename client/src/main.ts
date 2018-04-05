import Graticule from './mesh.graticule'
import {generateTextMesh, TEXT_ANCHOR} from './mesh.text'
import {initGlobals, getEngine, getScene, getCanvas} from './globals'
import {getEnvironment} from './environment'
import {EnvironmentState} from './interfaces'
import * as Materials from '../../shared/src/materials'
import {handleViewMove} from './events.network'

export default function init () {
  initGlobals()

  // Create the camera
  const camera = new BABYLON.ArcRotateCamera('main',
    -Math.PI / 2, Math.PI / 2, 10,
    new BABYLON.Vector3(16, 16, 0), getScene())

  camera.mode = BABYLON.Camera.ORTHOGRAPHIC_CAMERA
  camera.orthoBottom = -100
  camera.orthoTop = 100
  camera.orthoLeft = -100
  camera.orthoRight = 100

  // TODO: write custom camera code & call handleViewMove whith a debounce
  handleViewMove(camera)

  // getScene().debugLayer.show()

  const graticule = new Graticule(camera)

  generateTextMesh('monospace', 'normal', 'origin',
      6, new BABYLON.Vector2(16, 16), TEXT_ANCHOR.CENTER)

  getEngine().runRenderLoop(function () {
    graticule.update()
    getScene().render()
  })
}
