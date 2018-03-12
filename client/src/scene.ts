export default function init () {
  // Get canvas
  const canvas = document.getElementById("render-target") as HTMLCanvasElement

  // Create babylon engine
  const engine = new BABYLON.Engine(canvas, true)

  // Create scene
  const scene = new BABYLON.Scene(engine)

  // Create the camera
  const camera = new BABYLON.FreeCamera("camera", new BABYLON.Vector3(0,4,-10), scene)
  camera.setTarget(new BABYLON.Vector3(0,0,10))
  camera.attachControl(canvas)

  // Create light
  let light = new BABYLON.PointLight("light", new BABYLON.Vector3(0,5,-5), scene)

  BABYLON.Mesh.CreateSphere("sphere", 10, 0.3, scene)

  engine.runRenderLoop(function () {
    scene.render()
  })
}
