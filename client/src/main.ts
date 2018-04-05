import Graticule from './mesh.graticule'
import {generateTextMesh, TEXT_ANCHOR} from './mesh.text'
import {initGlobals, getEngine, getScene, getCanvas} from './globals'
import {getEnvironment} from './environment'
import {EnvironmentState} from './interfaces'
import * as Materials from '../../shared/src/materials'

export default function init () {
  initGlobals()

  // Create the camera
  const camera = new BABYLON.ArcRotateCamera('main',
    -Math.PI / 2, Math.PI / 2, 100,
    new BABYLON.Vector3(16, 16, 0), getScene())
  camera.attachControl(getCanvas())

  // getScene().debugLayer.show()

  const graticule = new Graticule(camera)

  generateTextMesh('monospace', 'normal', 'origin',
      6, new BABYLON.Vector2(16, 16), TEXT_ANCHOR.CENTER)

  // integrate a default state
  const tempState: EnvironmentState = {
    chunks: {}
  }
  tempState.chunks['0 0'] = []
  tempState.chunks['32 0'] = []
  tempState.chunks['32 32'] = []
  tempState.chunks['0 32'] = []
  tempState.chunks['-32 -32'] = []
  for(let i = 0; i < 32*32; i++) {
    const info = Materials.encodeMaterialInfo({
      class: i > 400 ? Materials.MATERIAL_LIMESTONE : Materials.MATERIAL_HYDROGEN,
      temperature: 50,
      pressure: 0,
      amount: 100
    })
    tempState.chunks['0 0'].push(info)
    tempState.chunks['32 0'].push(info)
    tempState.chunks['32 32'].push(info)
    tempState.chunks['0 32'].push(info)
    tempState.chunks['-32 -32'].push(info)
  }
  getEnvironment().updateState(tempState)

  getEngine().runRenderLoop(function () {
    graticule.update()
    getScene().render()
  })
}
