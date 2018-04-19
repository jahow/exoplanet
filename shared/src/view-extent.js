import {CHUNK_SIZE} from './globals'

/**
 * Compare two extents; returns true if different
 */
export function compareExtents (extent1, extent2) {
  return extent1.minX !== extent2.minX ||
    extent1.minY !== extent2.minY ||
    extent1.maxX !== extent2.maxX ||
    extent1.maxY !== extent2.maxY
}

export function isCoordInExtent (x, y, extent) {
  return x >= extent.minX && x <= extent.maxX &&
  	y >= extent.minY && y <= extent.maxY
}

/**
 * Returns an array of chunks as [x, y] arrays, based on
 * an extent (min/max X, min/max Y)
 */
export function getChunksInExtent (extent) {
  const coords = []
  const baseX = Math.floor(extent.minX / CHUNK_SIZE) * CHUNK_SIZE
  const baseY = Math.floor(extent.minY / CHUNK_SIZE) * CHUNK_SIZE
  let x, y
  for (x = baseX; x <= extent.maxX; x += CHUNK_SIZE) {
    for (y = baseY; y <= extent.maxY; y += CHUNK_SIZE) {
      coords.push([x, y])
    }
  }
  return coords
}

/**
 * Returns an array of chunks that are contained in extent2
 * but not in extent1; useful for sending only new chunks
 * when panning view
 */
export function getChunksBySubtractingExtents (extent1, extent2) {
  const coords = []
  const baseX = Math.floor(extent2.minX / CHUNK_SIZE) * CHUNK_SIZE
  const baseY = Math.floor(extent2.minY / CHUNK_SIZE) * CHUNK_SIZE
  let x, y
  for (x = baseX; x <= extent2.maxX; x += CHUNK_SIZE) {
    for (y = baseY; y <= extent2.maxY; y += CHUNK_SIZE) {
    	if (isCoordInExtent(x, y, extent1)) continue
      coords.push([x, y])
    }
  }
  return coords
}