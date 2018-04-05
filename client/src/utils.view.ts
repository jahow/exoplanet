import {ViewExtent} from './interfaces'
import {getCanvas} from './globals'
import {CHUNK_SIZE} from '../../shared/src/globals'

const DEFAULT_VIEW_EXTENT = 220

/**
 * Set an ortho camera to point a target position with a specified distance
 * note: distance is the factor applied to the default view size
 */
export function adjustView(camera: BABYLON.Camera, target: BABYLON.Vector2, distance: number) {
  const canvas = camera.getEngine().getRenderingCanvas()
  const ratio = canvas.width / canvas.height
  let width = DEFAULT_VIEW_EXTENT * distance
  let height = width / ratio

  camera.orthoBottom = target.y - height / 2
  camera.orthoTop = target.y + height / 2
  camera.orthoLeft = target.x - width / 2
  camera.orthoRight = target.x + width / 2
}

/**
 * Same but with relative effect (values are added)
 */
export function adjustViewRelative(camera: BABYLON.Camera, targetDiff: BABYLON.Vector2, distanceDiff: number) {
  const target = new BABYLON.Vector2(
    targetDiff.x + (camera.orthoLeft + camera.orthoRight) / 2,
    targetDiff.y + (camera.orthoBottom + camera.orthoTop) / 2
  )
  const distance = distanceDiff +
    (camera.orthoRight - camera.orthoLeft) / DEFAULT_VIEW_EXTENT
  adjustView(camera, target, distance)
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