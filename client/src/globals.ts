let engine: BABYLON.Engine
let canvas: HTMLCanvasElement
let scene: BABYLON.Scene

export function initGlobals() {
  canvas = document.getElementById('render-target') as HTMLCanvasElement
  engine = new BABYLON.Engine(canvas, true)
  engine.setDepthBuffer(false)
  scene = new BABYLON.Scene(engine)
}

export function getScene(): BABYLON.Scene {
  return scene
}

export function getEngine(): BABYLON.Engine {
  return engine
}

export function getCanvas(): HTMLCanvasElement {
  return canvas
}
