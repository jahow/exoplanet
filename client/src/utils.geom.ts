/**
 * Will push a quad into the given buffers
 * @param positions
 * @param colors
 * @param indices
 * @param minX
 * @param maxX
 * @param minY
 * @param maxY
 * @param color
 */
export function pushColoredQuad(
  positions: number[],
  colors: number[],
  indices: number[],
  minX: number,
  maxX: number,
  minY: number,
  maxY: number,
  color: BABYLON.Color4
) {
  const stride = 3
  const i = positions.length / stride
  if (Math.floor(i) !== i) {
    console.error('incorrect stride: ', i)
    return
  }
  positions.push(minX, minY, 0, maxX, minY, 0, maxX, maxY, 0, minX, maxY, 0)
  colors.push(
    color.r,
    color.g,
    color.b,
    color.a,
    color.r,
    color.g,
    color.b,
    color.a,
    color.r,
    color.g,
    color.b,
    color.a,
    color.r,
    color.g,
    color.b,
    color.a
  )
  indices.push(i, i + 1, i + 2, i, i + 2, i + 3)
}

/**
 * Will push a quad into the given buffers
 * @param positions
 * @param colors
 * @param indices
 * @param textureCoords
 * @param minX
 * @param maxX
 * @param minY
 * @param maxY
 * @param color
 * @param minU
 * @param maxU
 * @param minV
 * @param maxV
 */
export function pushTexturedQuad(
  positions: number[],
  colors: number[],
  textureCoords: number[],
  indices: number[],
  minX: number,
  maxX: number,
  minY: number,
  maxY: number,
  color: BABYLON.Color4,
  minU: number,
  maxU: number,
  minV: number,
  maxV: number
) {
  const stride = 3
  const i = positions.length / stride
  if (Math.floor(i) !== i) {
    console.error('incorrect stride: ', i)
    return
  }
  positions.push(minX, minY, 0, maxX, minY, 0, maxX, maxY, 0, minX, maxY, 0)
  colors.push(
    color.r,
    color.g,
    color.b,
    color.a,
    color.r,
    color.g,
    color.b,
    color.a,
    color.r,
    color.g,
    color.b,
    color.a,
    color.r,
    color.g,
    color.b,
    color.a
  )
  textureCoords.push(minU, minV, maxU, minV, maxU, maxV, minU, maxV)
  indices.push(i, i + 1, i + 2, i, i + 2, i + 3)
}
