import Graticule from './graticule'

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

  BABYLON.Mesh.CreateSphere("sphere", 10, 1, scene)
  let s1 = BABYLON.Mesh.CreateSphere("sphere", 10, 1, scene)
  s1.position.set(32, 0, 0)
  let s2 = BABYLON.Mesh.CreateSphere("sphere", 10, 1, scene)
  s2.position.set(0, 32, 0)

  const graticule = new Graticule(scene, camera)

  engine.runRenderLoop(function () {
    graticule.update()
    scene.render()
  })
}
