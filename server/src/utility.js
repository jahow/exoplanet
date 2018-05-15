export function getTime() {
  const t = process.hrtime()
  return t[0] * 1000000 + t[1] / 1000
}

export function cap(v, min, max) {
  return Math.max(Math.min(v, max), min)
}

export function capExtent(extent, maxSize) {
  const centerX = (extent.maxX + extent.minX) / 2
  const centerY = (extent.maxY + extent.minY) / 2
  const sizeX = cap(extent.maxX - extent.minX, 1, maxSize)
  const sizeY = cap(extent.maxY - extent.minY, 1, maxSize)

  return {
    minX: Math.floor(centerX - sizeX / 2),
    maxX: Math.floor(centerX + sizeX / 2),
    minY: Math.floor(centerY - sizeY / 2),
    maxY: Math.floor(centerY + sizeY / 2)
  }
}
