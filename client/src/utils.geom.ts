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
export function pushQuad (
    positions: number[], colors: number[], indices: number[],
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