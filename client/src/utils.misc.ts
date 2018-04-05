import {ViewExtent} from './interfaces'
import {CHUNK_SIZE} from '../../shared/src/globals'

/**
 * Returns an array of values from a range
 */
export function arrayFromRange (min: number, max: number) {
  let min_ = Math.floor(min)
  let max_ = Math.floor(max)
  const result = new Array(max_ - min_)
  for (let i = 0; i < max_ - min_; i++) {
    result[i] = min_ + i
  }
  return result
}

/**
 * Returns an extent (min/max X, min/max Y) from a camera
 * Extent is then rounded on grid chunks
 */
export function getViewExtent(camera: BABYLON.Camera): ViewExtent {
  let canvas = camera.getEngine().getRenderingCanvas()
  let ratio = canvas.width / canvas.height

  const extent = {
    minX: camera.orthoLeft,
    maxX: camera.orthoRight,
    minY: camera.orthoBottom,
    maxY: camera.orthoTop
  }

  // round on chunks
  extent.minX = Math.floor(extent.minX / CHUNK_SIZE) * CHUNK_SIZE
  extent.minY = Math.floor(extent.minY / CHUNK_SIZE) * CHUNK_SIZE
  extent.maxX = Math.ceil(extent.maxX / CHUNK_SIZE) * CHUNK_SIZE
  extent.maxY = Math.ceil(extent.maxY / CHUNK_SIZE) * CHUNK_SIZE

  return extent
}