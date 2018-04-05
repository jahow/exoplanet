import Graticule from './mesh.graticule'
import {generateTextMesh, TEXT_ANCHOR} from './mesh.text'
import {initGlobals, getEngine, getScene, getCanvas} from './globals'
import {getEnvironment} from './environment'
import {EnvironmentState} from './interfaces'
import * as Materials from '../../shared/src/materials'
import {initView, updateView} from './utils.view'
import {initInput, updateInputState} from './utils.input'

export default function init () {
  initGlobals()
  initInput()
  initView()

  window.onresize = () => {
    getEngine().resize()
  }

  // getScene().debugLayer.show()

  const graticule = new Graticule()

  generateTextMesh('monospace', 'normal', 'origin',
      6, new BABYLON.Vector2(16, 16), TEXT_ANCHOR.CENTER)

  const viewDiff = BABYLON.Vector2.Zero()

  getEngine().runRenderLoop(function () {
    graticule.update()
    updateInputState()
    updateView()

    getScene().render()
  })
}
