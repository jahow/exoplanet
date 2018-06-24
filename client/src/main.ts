import Graticule from './mesh.graticule'
import { generateTextMesh, TEXT_ANCHOR } from './mesh.text'
import { initGlobals, getEngine, getScene, getCanvas } from './globals'
import { getEnvironment } from './environment'
import { EnvironmentState } from './interfaces'
import * as Materials from '../../shared/src/materials'
import { initView, updateView } from './utils.view'
import { initInput, updateInputState, isKeyPressed } from './utils.input'
import { toggleDebugMode } from './utils.misc'
import { updateJobQueue } from './utils.jobs'
import { Overlay } from './ui'

export default function init() {
  initGlobals()
  initInput()
  initView()

  const uiOverlay = new Overlay()

  window.onresize = () => {
    getEngine().resize()
    uiOverlay.handleResize()
  }

  // getScene().debugLayer.show()

  const graticule = new Graticule()

  getEngine().runRenderLoop(function() {
    // debug mode
    if (isKeyPressed('*', true)) {
      toggleDebugMode()
    }

    graticule.update()
    updateInputState()
    updateView()
    updateJobQueue()
    uiOverlay.update()

    getScene().render()
  })
}
