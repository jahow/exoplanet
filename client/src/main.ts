import Graticule from './mesh.graticule'
import { generateTextMesh } from './mesh.text'
import { initGlobals, getEngine, getScene, getCanvas } from './globals'
import { getEnvironment } from './environment'
import { EnvironmentState } from './interfaces'
import * as Materials from '../../shared/src/materials'
import { initView, updateView } from './utils.view'
import { initInput, updateInputState, isKeyPressed } from './utils.input'
import { toggleDebugMode } from './utils.misc'
import { updateJobQueue } from './utils.jobs'
import { getOverlayManager } from './utils.overlay'
import { initUI } from './ui'

export default function init() {
  initGlobals()
  initInput()
  initView()

  window.onresize = () => {
    getEngine().resize()
    getOverlayManager().handleResize()
  }

  initUI()
  getOverlayManager().handleResize()

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
    getOverlayManager().update()

    getScene().render()
    getOverlayManager().render()
  })
}
