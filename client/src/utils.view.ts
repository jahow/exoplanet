import {ViewExtent} from './interfaces'
import {getCanvas, getEngine} from './globals'
import {CHUNK_SIZE} from '../../shared/src/globals'
import {updateInputState, isKeyPressed, KeyCode} from './utils.input'
import {handleViewMove} from './events.network'

const DEFAULT_VIEW_EXTENT = 220

// unit per second
const VIEW_PAN_SPEED = 100

/**
 * Set an ortho camera to point a target position with a specified distance
 * note: distance is the factor applied to the default view size
 */
export function adjustView(camera: BABYLON.Camera, target: BABYLON.Vector2, distance: number) {
  const canvas = getCanvas()
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
  let canvas = getCanvas()
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

/**
 * Compare two extents; returns true if different
 */
export function compareExtents(extent1: ViewExtent, extent2: ViewExtent): boolean {
  return extent1.minX !== extent2.minX ||
    extent1.minY !== extent2.minY ||
    extent1.maxX !== extent2.maxX ||
    extent1.maxY !== extent2.maxY
}

const viewDiff = BABYLON.Vector2.Zero()
let previousExtent: ViewExtent, newExtent

/**
 * Run this on the update loop to update the view according to pressed keys
 */
export function updateView(camera: BABYLON.Camera) {
  // move camera
  viewDiff.scaleInPlace(0)
  const delta = getEngine().getDeltaTime()
  if (isKeyPressed(KeyCode.DOWN)) viewDiff.y -= 1
  if (isKeyPressed(KeyCode.UP)) viewDiff.y += 1
  if (isKeyPressed(KeyCode.LEFT)) viewDiff.x -= 1
  if (isKeyPressed(KeyCode.RIGHT)) viewDiff.x += 1
  viewDiff.scaleInPlace(delta * 0.001 * VIEW_PAN_SPEED)
  adjustViewRelative(camera, viewDiff, 0)

  // check if extent has changed
  newExtent = getViewExtent(camera)
  if (!previousExtent || compareExtents(newExtent, previousExtent)) {
    handleViewMove(camera)
  }
  previousExtent = newExtent
}