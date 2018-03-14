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
    new BABYLON.Vector3(0, 0, 0), scene)
  camera.attachControl(canvas)

  // Create light
  scene.ambientColor = BABYLON.Color3.White()

  BABYLON.Mesh.CreateSphere("sphere", 10, 1, scene)
  let s1 = BABYLON.Mesh.CreateSphere("sphere", 10, 1, scene)
  s1.position.set(32, 0, 0)
  let s2 = BABYLON.Mesh.CreateSphere("sphere", 10, 1, scene)
  s2.position.set(0, 32, 0)

  // const genericMaterial = new BABYLON.StandardMaterial('generic', scene)
  // genericMaterial.diffuseColor = BABYLON.Color3.White()
  // genericMaterial.specularColor = BABYLON.Color3.Black()
  const genericMaterial = new BABYLON.ShaderMaterial('generic', scene, './generic-shader',
    {
        attributes: ['position', 'color'],
        uniforms: ['worldViewProjection' ]
    });

  genericMaterial.backFaceCulling = false

  const positions: number[] = []
  const colors: number[] = []
  const indices: number[] = []

  pushQuad(positions, colors, indices,
    -2, 0, -5, 3, BABYLON.Color4.FromInts(255, 255, 255, 130))
  pushQuad(positions, colors, indices,
    -5, 3, -2, 0, BABYLON.Color4.FromInts(255, 255, 255, 130))

  const graticule = new BABYLON.Mesh('graticule')
  graticule.material = genericMaterial
  graticule.setVerticesData(BABYLON.VertexBuffer.PositionKind, positions, true);
  graticule.setVerticesData(BABYLON.VertexBuffer.ColorKind, colors, true);
  graticule.setIndices(indices, positions.length / 3, true)


  engine.runRenderLoop(function () {
    scene.render()
  })
}

/**
 * Will push a quad into the given buffers
 * note: assumed vertex stride is 6 (x,y,r,g,b,a)
 * @param positions
 * @param colors
 * @param indices
 * @param minX
 * @param maxX
 * @param minY
 * @param maxY
 * @param color
 */
function pushQuad (positions: number[], colors: number[], indices: number[],
  minX: number, maxX: number, minY: number, maxY: number,
  color: BABYLON.Color4) {
    const stride = 3
    const i = positions.length / stride
    if (Math.floor(i) !== i) {
      console.error('incorrect stride: ', i)
      return
    }
    positions.push(
      minX, minY, 0,
      maxX, minY, 0,
      maxX, maxY, 0,
      minX, maxY, 0
    )
    colors.push(
      color.r, color.g, color.b, color.a,
      color.r, color.g, color.b, color.a,
      color.r, color.g, color.b, color.a,
      color.r, color.g, color.b, color.a
    )
    indices.push(
      i, i + 1, i + 2,
      i, i + 2, i + 3
    )
}
