import Graticule from './mesh.graticule'
import {generateTextMesh, TEXT_ANCHOR} from './mesh.text'
import {initGlobals, getEngine, getScene, getCanvas} from './globals'
import {getEnvironment} from './environment'
import {EnvironmentState} from './interfaces'
import * as Materials from '../../shared/src/materials'
import {initView, updateView} from './utils.view'
import {initInput, updateInputState, isKeyPressed} from './utils.input'
import {toggleDebugMode} from './utils.misc'

export default function init () {
  initGlobals()
  initInput()
  initView()

  window.onresize = () => {
    getEngine().resize()
  }

  // getScene().debugLayer.show()

  const graticule = new Graticule()

  getEngine().runRenderLoop(function () {
    // debug mode
    if (isKeyPressed('*', true)) {
      toggleDebugMode()
    }

    graticule.update()

    updateInputState()
    updateView()

    getScene().render()

  })
}
